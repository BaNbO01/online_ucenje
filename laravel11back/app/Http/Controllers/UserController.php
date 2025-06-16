<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\KursResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Log;
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
        if(!$user->jeRole('student')){
            return response()->json([
                'success' => false,
                'message' => 'Nemate prava da prikazete omiljene kurseve.'
            ], 403);
        }
       
        return KursResource::collection($user->omiljeniKursevi()->paginate(5));
       
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
        if(!$user->jeRole('nastavnik')){
            return response()->json([
                'success' => false,
                'message' => 'Nemate prava da prikazete kurseve jer niste nastavnik.'
            ], 403);
        }
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

       
        if(!$user->jeRole('student')){
            return response()->json([
                'success' => false,
                'message' => 'Nemate prava da dodate kurs u omiljene.'
            ], 403);
        }
     
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

        if(!$user->jeRole('student')){
            return response()->json([
                'success' => false,
                'message' => 'Nemate prava da uklonite kurs iz omiljenih.'
            ], 403);
        }
        $user->omiljeniKursevi()->detach($kurs->id);
        return response()->json(['message' => 'Kurs je uspešno uklonjen iz omiljenih.'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Došlo je do greške prilikom uklanjanja kursa iz omiljenih.'], 500);
    }
}

public function getTeachers()
{
    
    $teachers = User::where('role', 'nastavnik')->get();
    return UserResource::collection($teachers);
}

public function getStudents()
{
    $user = Auth::user();
    if(!$user->jeRole('admin')){
        return response()->json([
            'success' => false,
            'message' => 'Nemate prava da vratite sve studente.'
        ], 403);
    }
    $students = User::where('role', 'student')->get();
    return UserResource::collection($students);
}

    
}
