<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cas extends Model
{
    use HasFactory;

    protected $table = 'casovi';
    protected $fillable = ['naziv', 'opis', 'kurs_id'];


    public function kurs()
    {
        return $this->belongsTo(Kurs::class);
    }

    
    public function materijali()
    {
        return $this->hasMany(Materijal::class);
    }
}

