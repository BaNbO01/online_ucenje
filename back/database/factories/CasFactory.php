<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Cas;
use App\Models\Kurs;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cas>
 */
class CasFactory extends Factory
{

    protected $model = Cas::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'naziv' => 'Čas ' . $this->faker->numberBetween(1, 10),
            'opis' => $this->faker->sentence(),
           'kurs_id' => $this->faker->randomElement(Kurs::pluck('id')->toArray()),
        ];
    }
}
