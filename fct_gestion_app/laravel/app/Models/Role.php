<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
