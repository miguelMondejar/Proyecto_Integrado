<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidatura extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'estado',
        'usuario_id',
        'empresa_id'
    ];

    public function empresa() {
        return $this->belongsTo(Empresa::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
