<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Kurs;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Kurs>
 */
class KursFactory extends Factory
{

    protected $model = Kurs::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        return [
            'naziv' => $this->faker->words(3, true),
            'opis' => $this->faker->paragraph(),
            'putanja_do_slike' => $this->faker->imageUrl(640, 480, 'course'),
           'user_id' => $this->faker->randomElement(User::where('role', 'nastavnik')->pluck('id')->toArray()), // Koristi postojeće nastavnike
        ];
    }
}
