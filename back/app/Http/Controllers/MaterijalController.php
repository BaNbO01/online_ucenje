<?php

namespace App\Http\Controllers;

use App\Models\Materijal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\File;
use App\Models\Cas;
use Illuminate\Support\Facades\Storage;

class MaterijalController extends Controller
{
    public function delete($id)
    {
        try {
      
            $materijal = Materijal::findOrFail($id);
            $user = Auth::user();

           
            if (!$user->jeRole("admin") && $user->id !== $materijal->cas->kurs->user_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate dozvolu da obrišete ovaj materijal.',
                ], 403);
            }

            $putanjaFajla = public_path($materijal->putanja);
                $putanja = str_replace('/', '\\', $putanjaFajla); 
                if (File::exists($putanja)) {
                    File::delete($putanja);
                }
            $materijal->delete();
            return response()->json([
                'success' => true,
                'message' => 'Materijal je uspešno obrisan.',
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom brisanja materijala.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function getVideo($id)
{
    try {
        // Pronađi materijal
        $materijal = Materijal::findOrFail($id);

        // Proveri da li je materijal video fajl
        if ($materijal->tip !== 'video/mp4') {
            return response()->json(['error' => 'Materijal nije video'], 400);
        }

        // Priprema putanje fajla
        $relativePath = $materijal->putanja;
        $absolutePath = public_path($relativePath); // Konvertuje u apsolutnu putanju
        $absolutePath = str_replace('/', '\\', $absolutePath);
        Log::info("Pokušavam da učitam fajl sa putanje: $absolutePath");

        // Proveri da li fajl postoji
        if (!File::exists($absolutePath)) {
            return response()->json(['error' => 'Fajl ne postoji'], 404);
        }

       
        return response()->stream(function () use ($absolutePath) {
            readfile($absolutePath);
        }, 200, [
            'Content-Type' => 'video/mp4',
            'Accept-Ranges' => 'bytes',
            'Content-Length' => filesize($absolutePath),
        ]);
    } catch (\Exception $e) {
        Log::error('Greška prilikom učitavanja videa: ' . $e->getMessage());
        return response()->json(['error' => 'Došlo je do greške prilikom učitavanja videa.'], 500);
    }
}




public function store(Request $request)
{
    // Validacija ulaznih podataka
    $request->validate([
        'cas_id' => 'required|exists:casovi,id', 
        'naziv' => 'required|string', 
        'file' => 'required|file|mimes:pdf,mp4', 
    ]);

    try {
       
        $cas = Cas::findOrFail($request->cas_id);
        $fajl = $request->file('file');
        
        $putanja = $this->uploadFajl($fajl, $request->naziv, $cas);

      
        $materijal = Materijal::create([
            'naziv' => $request->naziv,
            'putanja' => $putanja, 
            'tip' => $fajl->getMimeType(),  
            'cas_id' => $cas->id,  
        ]);

        return response()->json([
            'message' => 'Materijal je uspešno sačuvan.',
            'materijal' => $materijal,
        ], 201);

    } catch (\Exception $e) {
        Log::error('Greška prilikom dodavanja materijala: ' . $e->getMessage());
        return response()->json([
            'message' => 'Došlo je do greške prilikom dodavanja materijala.',
        ], 500);
    }
}

private function uploadFajl($file, $naziv, $cas)
{
    $originalExtension = $file->getClientOriginalExtension(); 
    $filename = $naziv . '.' . $originalExtension;

    // Pronađi kurs koji je vezan za čas
    $kurs = $cas->kurs; // Predpostavljamo da je 'kurs' relacija na Cas modelu
    
    // Sanitizacija naziva kursa, časa i materijala za direktorijume
    $sanitizedNazivKursa = preg_replace('/[^a-zA-Z0-9_-]/', '_', $kurs->naziv);
    $sanitizedNazivCasa = preg_replace('/[^a-zA-Z0-9_-]/', '_', $cas->naziv);
    $sanitizedNazivMaterijala = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);

    // Kreiraj putanju za kurs, zatim za čas unutar tog kursa
    $path = 'public/app/' . $sanitizedNazivKursa . '/' . $sanitizedNazivCasa;

    // Proveri da li direktorijum postoji za kurs, ako ne, napravi ga
    if (!Storage::exists($path)) {
        Storage::makeDirectory($path);
    }

    // Putanja za materijal unutar određenog časa
    $pathFile = $path . '/' . $sanitizedNazivMaterijala;

    // Snimanje fajla u odgovarajući direktorijum
    $filePath = $file->storeAs($path, $filename);

    // Kreiranje zapisa u bazi o materijalu
    return str_replace('public/', 'storage/', $filePath);
}



}
