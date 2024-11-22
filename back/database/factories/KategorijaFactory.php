<?php

namespace Database\Factories;

use App\Models\Kategorija;
use Illuminate\Database\Eloquent\Factories\Factory;

class KategorijaFactory extends Factory
{
    protected $model = Kategorija::class;

    public function definition()
    {
        return [
            'naziv' => $this->faker->word(),  // Generiši nasumičan naziv kategorije
        ];
    }
}
