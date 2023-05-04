<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Curriculum extends Model
{
    protected $table = 'curriculums';
    public $timestamps = false;
    
    protected $fillable = [
        'ruta', 
        'usuario_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
