<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cas;
use App\Models\Kurs;
use App\Models\Materijal;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class CasController extends Controller
{
    public function destroy($id)
{
    try {
       
        $cas = Cas::findOrFail($id);
        $kurs = $cas->kurs;
        $user = Auth::user();

        
        if ($user->id !== $kurs->user_id && !$user->jeRole('admin')) {
          
            return response()->json([
                'success' => false,
                'message' => 'Nemate prava da obrišete ovaj čas.'
            ], 403);  
        }
        $cas->delete();
        return response()->json([
            'success' => true,
            'message' => 'Čas uspešno obrisan.'
        ], 200);

    } catch (\Exception $e) {
      
        return response()->json([
            'success' => false,
            'message' => 'Došlo je do greške prilikom brisanja časa.',
            'error' => $e->getMessage(),
        ], 500);
    }
}




public function store(Request $request)
{
    try{
        Log::info('Request Data:', $request->all());

        $request->validate([
            'naziv' => 'required|string',
            'opis' => 'nullable|string',
            'kurs_id' => 'required|exists:kursevi,id',
            'materijali' => 'required|array',
            'materijali.*.file' => 'required|mimes:pdf,mp4', // Dozvoljeni formati
            'materijali.*.naziv' => 'required|string',
        ]);
    
        // Kreiranje časa
        $cas = Cas::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'kurs_id' => $request->kurs_id,
        ]);
    
        // Dohvati kurs da bismo organizovali direktorijum
        $kurs = Kurs::findOrFail($request->kurs_id);
    
        $materijaliData = [];
        foreach ($request->materijali as $materijal) {
            $file = $materijal['file'];
    
            // Kreiraj i sačuvaj fajl
            $uploadedFile = $this->uploadFajl($file, $materijal['naziv'], $kurs, $cas);
    
            // Dodaj podatke o materijalu u bazu
            $materijaliData[] = Materijal::create([
                'naziv' => $materijal['naziv'],
                'putanja' => $uploadedFile,
                'tip' => $file->getMimeType(),
                'cas_id' => $cas->id,
            ]);
        }
    
        return response()->json([
            'message' => 'Čas i materijali su uspešno sačuvani',
            'cas' => $cas,
            'materijali' => $materijaliData,
        ], 201);
    }catch (\Exception $e) {
      
        return response()->json([
            'success' => false,
            'message' => 'Došlo je do greške prilikom kreiranja časa.',
            'error' => $e->getMessage(),
        ], 500);
    }
    
}


private function uploadFajl($file, $naziv, $kurs, $cas)
{
    $originalExtension = $file->getClientOriginalExtension();
    $filename = $naziv . '.' . $originalExtension;

    // Sanitizacija naziva za direktorijume
    $sanitizedKursNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $kurs->naziv);
    $sanitizedCasNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $cas->naziv);

    // Organizacija direktorijuma
    $basePath = 'public/app/' . $sanitizedKursNaziv . '/' . $sanitizedCasNaziv;
    if (!Storage::exists($basePath)) {
        Storage::makeDirectory($basePath);
    }

    // Sačuvaj fajl
    $pathFile = $file->storeAs($basePath, $filename);

    return str_replace('public/', 'storage/', $pathFile);
  

}


}
