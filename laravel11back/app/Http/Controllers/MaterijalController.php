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

           
            if ($user->jeRole("admin") || $user->id === $materijal->cas->kurs->user_id) {
             
           

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
        }
            else{
                   return response()->json([
                    'success' => false,
                    'message' => 'Nemate dozvolu da obrišete ovaj materijal.',
                ], 403);
            }

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
        $materijal = Materijal::findOrFail($id);
        $user = Auth::user();
        $prijava = $user->prijave()
                            ->where('kurs_id', $materijal->cas->kurs->id)
                            ->where('zahtev', 'primljen')
                            ->first();

                if($prijava || $materijal->cas->kurs->predavac->id===$user->id || $user->jeRole('admin')){
                               
                          

                            if ($materijal->tip !== 'video/mp4') {
                                return response()->json(['error' => 'Materijal nije video'], 400);
                            }

                            $relativePath = $materijal->putanja;
                            $absolutePath = public_path($relativePath); // Konvertuje u apsolutnu putanju
                        
                            Log::info("Pokušavam da učitam fajl sa putanje: $absolutePath");

                        
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
    }
        else{
               return response()->json([
                                    'success' => false,
                                    'message' => 'Nemate dozvolu da pristupite ovom casu.'
                                ], 403);
        }
    } catch (\Exception $e) {
        Log::error('Greška prilikom učitavanja videa: ' . $e->getMessage());
        return response()->json(['error' => 'Došlo je do greške prilikom učitavanja videa.'], 500);
    }
}




public function store(Request $request)
{
   
  

    try {

          $request->validate([
        'cas_id' => 'required|exists:casovi,id', 
        'naziv' => 'required|string', 
        'file' => 'required|file|mimes:pdf,mp4', 
    ]);
       
        $cas = Cas::findOrFail($request->cas_id);
        $fajl = $request->file('file');

        $user = Auth::user();
        if (!($user->jeRole("nastavnik") && $user->id == $cas->kurs->user_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Nemate dozvolu da dodate materijal.',
            ], 403);
        }
        
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

   
    $kurs = $cas->kurs;
    
   
    $sanitizedNazivKursa = preg_replace('/[^a-zA-Z0-9_-]/', '_', $kurs->naziv);
    $sanitizedNazivCasa = preg_replace('/[^a-zA-Z0-9_-]/', '_', $cas->naziv);
    $sanitizedNazivMaterijala = preg_replace('/[^a-zA-Z0-9_-]/', '_', $naziv);

    
    $path = 'app/' . $sanitizedNazivKursa . '/' . $sanitizedNazivCasa;

    if (!Storage::exists($path)) {
        Storage::makeDirectory($path);
    }

    $filePath = $file->storeAs($path, $filename,"public");

    return Storage::url($filePath);
}



}
