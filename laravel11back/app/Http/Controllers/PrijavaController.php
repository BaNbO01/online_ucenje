<?php

namespace App\Http\Controllers;

use App\Models\Prijava;
use App\Models\Kurs;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\PrijavaResource;

class PrijavaController extends Controller
{
    public function store(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user->jeRole('student')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Samo studenti mogu da se prijave.'
                ], 403);
            }

            $validated = $request->validate([
                'kurs_id' => 'required|exists:kursevi,id',
            ]);

            $prijava = Prijava::create([
                'student_id' => $user->id,
                'kurs_id' => $validated['kurs_id'],
                'zahtev' => 'u toku',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Uspešno ste poslali prijavu.',
                'data' => new PrijavaResource($prijava)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Došlo je do greške pri slanju prijave.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $user = Auth::user();

            if (!$user->jeRole('nastavnik')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate prava da izmenite ovu prijavu.'
                ], 403);
            }

            $validated = $request->validate([
                 'zahtev' => 'required|in:u toku,primljen,odbijen',
                 'polozio' => 'required|boolean',
                  'ocena' => 'nullable|in:5,6,7,8,9,10',
            ]);

            $prijava = Prijava::findOrFail($id);
            if($prijava->kurs->user_id!==$user->id){
                  return response()->json([
                    'success' => false,
                    'message' => 'Nemate prava da izmenite ovu prijavu.'
                ], 403);
            }
            $prijava->zahtev = $validated['zahtev'];
            $prijava->polozio=$validated['polozio'];
            $prijava->ocena=$validated['ocena'];
            $prijava->save();

            return response()->json([
                'success' => true,
                'message' => 'Status prijave uspešno ažuriran.',
                'data' => new PrijavaResource($prijava)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Došlo je do greške pri izmeni prijave.',
                'message' => $e->getMessage()
            ], 500);
        }
    }




public function mojePrijave(Request $request)
{
    try {
        $user = Auth::user();

        if (!$user->jeRole('student')) {
            return response()->json([
                'success' => false,
                'message' => 'Samo studenti mogu pristupiti svojim prijavama.'
            ], 403);
        }

        $prijave = Prijava::where('student_id', $user->id)
            ->orderBy('updated_at', 'desc')
            ->paginate(10);

        return PrijavaResource::collection($prijave);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške pri učitavanju prijava.',
            'message' => $e->getMessage()
        ], 500);
    }
}



}
