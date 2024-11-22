<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kurs extends Model
{
    use HasFactory;

    protected $table = 'kursevi';
    protected $fillable = ['naziv', 'opis','putanja_do_slike' ,'user_id'];

    // Veza sa vlasnikom kursa
    public function predavac()
    {
        return $this->belongsTo(User::class,"user_id");
    }

    // Veza sa časovima u kursu
    public function casovi()
    {
        return $this->hasMany(Cas::class);
    }

    public function kategorije()
    {
        return $this->belongsToMany(Kategorija::class, 'kurs_kategorija');
    }
}