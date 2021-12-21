<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bookable extends Model
{
    use HasFactory;

    public function bookings() {
        return $this->hasMany(Booking::class);
    }

    public function reviews() {
        return $this->hasMany(Review::class);
    }

    public function availableFor($from, $to) {
//        return 0 == $this->bookings()->betweenDates($from, $to)->count();
//        return $this->bookings()->where('to', '>=', $from)->where('from', '<=', $to)->count();
//        return $this->bookings()->where('from', '<=', $from)->where('to', '>=', $from)
//            ->where('from', '<=', $to)->where('to', '>=', $to)->count();
        return $this->bookings()->betweenDates($from, $to)->count();
    }
}
