<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cas;
use App\Models\User;
use App\Models\Kurs;
use App\Models\Materijal;
use App\Http\Resources\CasResource;
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

        
        if ($user->id=== $kurs->user_id || $user->jeRole('admin')) {
          
          
       
        $cas->delete();
        return response()->json([
            'success' => true,
            'message' => 'Čas uspešno obrisan.'
        ], 200);

         }
        else{
              return response()->json([
                'success' => false,
                'message' => 'Nemate prava da obrišete ovaj čas.'
            ], 403);  
        }

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
            'materijali.*.file' => 'required|mimes:pdf,mp4',
            'materijali.*.naziv' => 'required|string',
        ]);
    
        $user = Auth::user();

        $kurs = Kurs::findOrFail($request->kurs_id);
        if ($user->id === $kurs->user_id || $user->jeRole('admin')) {
          
          
        
        
        $cas = Cas::create([
            'naziv' => $request->naziv,
            'opis' => $request->opis,
            'kurs_id' => $request->kurs_id,
        ]);
    
      
        
    
        $materijaliData = [];
        foreach ($request->materijali as $materijal) {
            $file = $materijal['file'];
    
            $uploadedFile = $this->uploadFajl($file, $materijal['naziv'], $kurs, $cas);
    
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

        }

        else{
              return response()->json([
                'success' => false,
                'message' => 'Nemate prava da sacuvate čas.'
            ], 403);  
        }
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

    $sanitizedKursNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $kurs->naziv);
    $sanitizedCasNaziv = preg_replace('/[^a-zA-Z0-9_-]/', '_', $cas->naziv);

    $basePath = 'app/' . $sanitizedKursNaziv . '/' . $sanitizedCasNaziv;
    if (!Storage::exists($basePath)) {
        Storage::makeDirectory($basePath);
    }

    $pathFile = $file->storeAs($basePath, $filename,'public');

    
    return Storage::url($pathFile);
  

}


public function show($id){
    try{
         $cas = Cas::findOrFail($id);
        $user = Auth::user();
       
       
        $prijava = $user->prijave()
                            ->where('kurs_id', $cas->kurs->id)
                            ->where('zahtev', 'primljen')
                            ->first();
                           
            
         if ($prijava || $cas->kurs->predavac->id===$user->id || $user->jeRole('admin')) {
            return new CasResource($cas);
        }
        else{
             return response()->json([
                'success' => false,
                'message' => 'Nemate dozvolu da pristupite ovom casu.',
            ], 403);
        }
       
       

    }
    catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Došlo je do greške prilikom dobijanja casa.',
            'error' => $e->getMessage(),
        ], 500);
    }  
}


}
