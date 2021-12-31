<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

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

        return $this->bookings()->betweenDates($from, $to)->count() == 0;
    }

    public function priceFor($from, $to): array {
        $days = (new Carbon($from))->diffInDays(new Carbon($to)) + 1;

        $price = $this->price * $days;

        return [
            'total' => $price,
            'breakdown' => [
                $this->price => $days
            ]
        ];
    }
}
