<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MaterijalResource extends JsonResource
{
    public function toArray($request)
    {
        // Priprema URL ili rute za različite vrste materijala
        $materijalUrl = $this->getMaterijalUrl();

        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'tip' => $this->tip,
            'putanja' => $materijalUrl, 
        ];
    }

  
    public function getMaterijalUrl()
    {
        if ($this->tip === 'video/mp4') {
           
            return route('materijal.video', ['id' => $this->id]);
        } else {
            $fajlPutanja = rawurlencode($this->putanja); // Pretpostavljamo da je putanja u bazi
            $fajlPutanja = str_replace('%2F', '/', $fajlPutanja);
            return asset($fajlPutanja);
        }
    }
}
