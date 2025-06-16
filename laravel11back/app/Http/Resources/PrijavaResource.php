<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PrijavaResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'student' => [
                'id' => $this->student?->id,
                'name' => $this->student?->username,
                'email' => $this->student?->email,
            ],
            'zahtev' => $this->zahtev,
            'polozio'=>$this->polozio,
            'ocena'=>$this->ocena,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    
}
