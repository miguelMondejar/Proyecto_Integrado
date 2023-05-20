<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'direccion',
        'localidad',
        'provincia',
        'codigo_postal',
        'telefono',
        'empresa_id'	
    ];

    public function empresa() {
        return $this->belongsTo(Empresas::class);
    }
}
