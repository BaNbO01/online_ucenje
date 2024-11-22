<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Materijal extends Model
{
    use HasFactory;

    protected $table = 'materijali';
    protected $fillable = ['naziv', 'putanja', 'tip', 'cas_id'];


    public function cas()
    {
        return $this->belongsTo(Cas::class);
    }
}
