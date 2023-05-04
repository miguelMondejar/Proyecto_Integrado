<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'cif', 
        'nombre', 
        'email'
    ];

    public function candidatura() {
        return $this->hasMany(Candidatura::class);
    }

    public function sede() {
        return $this->hasMany(Sede::class);
    }
}
