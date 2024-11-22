<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kategorija extends Model
{
    use HasFactory;
    protected $table = 'kategorije';
    protected $fillable = ['naziv'];


    public function kursevi()
    {
        return $this->belongsToMany(Kurs::class, 'kurs_kategorija');
    }
}

