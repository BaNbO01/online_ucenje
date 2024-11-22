<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Materijal;
use App\Models\Cas;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Materijal>
 */
class MaterijalFactory extends Factory
{
    protected $model = Materijal::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition()
    {
        $tipovi = ['video/mp4', 'audio/mp3', 'application/pdf', 'application/vnd.ms-powerpoint'];
        $nazivi = ['cas1.mp4', 'cas1.mp3', 'cas1.pdf', 'cas1.ppt'];

        return [
            'naziv' => $this->faker->randomElement($nazivi),
            'putanja' => 'storage/Kurs' . $this->faker->numberBetween(1, 10) . '/Cas' . $this->faker->numberBetween(1, 10) . '/',
            'tip' => $this->faker->randomElement($tipovi),
            'cas_id' => $this->faker->randomElement(Cas::pluck('id')->toArray()),
        ];
    }
}
