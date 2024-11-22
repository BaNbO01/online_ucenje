<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\KursResource;
class UserController extends Controller
{
    public function destroy($id)
    {
        try {
          
            $user = Auth::user();
            if(!$user->jeRole('admin')){
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate prava da obrišete ovog korisnika.'
                ], 403);
            }


            $user = User::findOrFail($id);
            $user->kursevi()->delete();
            $user->delete();
            return response()->json([
                'success' => true,
                'message' => 'Korisnik i svi njegovi kursevi su obrisani.'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Došlo je do greške prilikom brisanja korisnika i kurseva.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



    public function getOmiljeniKursevi()
{
    try {
        
        $user = Auth::user();
        $omiljeniKursevi = $user->omiljeniKursevi;
        if($omiljeniKursevi->isEmpty()){
            return response()->json(['message' => 'Nemate nijedan omiljeni kurs.'], 200);
        }

        return response()->json([
            'success' => true,
            'data' => KursResouce::collection($omiljeniKursevi->paginate(10)),
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Došlo je do greške prilikom dobijanja omiljenih kurseva.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


public function mojiKursevi(Request $request)
{
    try{
        $user = Auth::user();
        $kursevi = $user->kursevi;  
        return KursResource::collection($kursevi);
    }
    catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Došlo je do greške prilikom dobijanja kurseva ulogovanog korisnika.',
            'error' => $e->getMessage(),
        ], 500);
    }

   
}


public function dodajUFavorite($id)
{
    try {
       
        $user = Auth::user();
        $kurs = Kurs::findOrFail($id);
     
        if (!$user->omiljeniKursevi->contains($kurs->id)) {
            $user->omiljeniKursevi()->attach($kurs->id);
        }
       
        return response()->json(['message' => 'Kurs je uspešno dodat u omiljene.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Došlo je do greške prilikom dodavanja kursa u omiljene.'], 500);
    }
}

public function ukloniIzFavorita($id)
{
    try {
        $user = Auth::user();
        $kurs = Kurs::findOrFail($id);
        $user->omiljeniKursevi()->detach($kurs->id);
        return response()->json(['message' => 'Kurs je uspešno uklonjen iz omiljenih.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Došlo je do greške prilikom uklanjanja kursa iz omiljenih.'], 500);
    }
}


}
