<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class KategorijaResource extends JsonResource
{
    public function toArray($request)
    {
       

        return [
          'id'=>$this->id,
          'naziv'=>$this->naziv,
        ];
    }
}
