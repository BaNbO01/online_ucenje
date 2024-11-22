<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CasResource extends JsonResource
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
            'materijali' => MaterijalResource::collection($this->materijali),
            'kreator_casa'=>new UserResource($this->kurs->predavac),
        ];
    }
}
