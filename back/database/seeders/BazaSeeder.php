<?php

// database/seeders/BazaSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kurs;
use App\Models\Cas;
use App\Models\Materijal;
use App\Models\Kategorija;

class BazaSeeder extends Seeder
{
    public function run()
    {
      
        $nastavnici = User::factory(5)->state(['role' => 'nastavnik'])->create();
        $studenti = User::factory(10)->state(['role' => 'student'])->create();

        
        $kategorije = Kategorija::factory(5)->create(); 

      
        foreach ($nastavnici as $nastavnik) {
            $kursevi = Kurs::factory(3)->create(['user_id' => $nastavnik->id]);

            
            foreach ($kursevi as $kurs) {
                $kurs->kategorije()->attach($kategorije->random(2));  
            }

            
            foreach ($kursevi as $kurs) {
                $casovi = Cas::factory(5)->create(['kurs_id' => $kurs->id]);

                
                foreach ($casovi as $cas) {
                    Materijal::factory(3)->create(['cas_id' => $cas->id]);
                }
            }
        }

       
        foreach ($studenti as $student) {
            $kursevi = Kurs::inRandomOrder()->take(2)->pluck('id');
            $student->omiljeniKursevi()->attach($kursevi);
        }
    }
}
