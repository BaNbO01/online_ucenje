<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kategorija;
use App\Http\Resources\KategorijaResource;
use Illuminate\Support\Facades\Auth;

class KategorijaController extends Controller
{
    public function index()
{
    try {
        $kategorije = Kategorija::all(); 
        return KategorijaResource::collection($kategorije);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Došlo je do greške prilikom dobijanja kategorija.',
            'message' => $e->getMessage(),
        ], 500);
    }
}



    public function store(Request $request)
    {
        
        $validated = $request->validate([
            'naziv' => 'required|string|max:255|unique:kategorije,naziv',
        ]);

        
        try {


            $user = Auth::user();
            if (!$user->jeRole("admin")) {
                return response()->json([
                    'success' => false,
                    'message' => 'Nemate dozvolu da dodate kategoriju.',
                ], 403);
            }
            $kategorija = Kategorija::create([
                'naziv' => $validated['naziv'], 
            ]);

          
            return response()->json([
                'message' => 'Kategorija uspešno dodata!',
                'data' => $kategorija,
            ], 201); 
        } catch (\Exception $e) {
         
            return response()->json([
                'error' => 'Došlo je do greške pri dodavanju kategorije.',
            ], 500); 
        }
    }

}
