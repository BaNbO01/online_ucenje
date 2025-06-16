<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;
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

        $loggedUser = Auth::user();
        return [
            'id' => $this->id,
            'naziv' => $this->naziv,
            'opis' => $this->opis,
            'putanja_do_slike' => asset($this->putanja_do_slike),
            'predavac' => new UserResource($this->predavac), 
            'casovi' => CasResource::collection($this->casovi), 
            'kategorije' => KategorijaResource::collection($this->kategorije),
            'prijave'=>PrijavaResource::collection($this->prijave),
            'kreirano' => $this->created_at,
            'azurirano' => $this->updated_at,
            'ocena'=>$this->ocenaStudentaNaKursu($this->id,$loggedUser),
            'slusa_kurs'=>$this->prijavljenNaKurs($this->id,$loggedUser),
        ];
    }

    public function ocenaStudentaNaKursu($id,$user) {
          $prijava = $user->prijave()
                            ->where('kurs_id', $id)
                            ->where('zahtev', 'primljen')
                            ->first();
    
        if($prijava){
            return $prijava->ocena;
        }else
        return null;
    }


    public function prijavljenNaKurs($id,$user){
        $prijava = $user->prijave()
        ->where('kurs_id',$id)
        ->first();

        if($prijava){
            return $prijava->zahtev;
        }
        else{
            return null;
        }

    }
}
