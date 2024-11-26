<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class KursResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'putanja_do_slike' => asset($this->putanja_do_slike),
            'predavac' => new UserResource($this->predavac), 
            'casovi' => CasResource::collection($this->casovi), 
            'kategorije' => KategorijaResource::collection($this->kategorije),
            'kreirano' => $this->created_at,
            'azurirano' => $this->updated_at,// Povezane kategorije, koristi KategorijaResource ako su učitane
        ];
    }
}
