<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prijava extends Model
{
    use HasFactory;

    protected $table = 'prijave';

    protected $fillable = [
        'student_id',
        'kurs_id',
        'zahtev',
        'polozio',
        'ocena'
    ];

      protected $casts = [
        'polozio' => 'boolean',
    ];

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function kurs()
    {
        return $this->belongsTo(Kurs::class, 'kurs_id');
    }
}
