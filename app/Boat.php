<?php

namespace App;

use App\Traits\HasGuild;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Boat
 *
 * @property int                             $id
 * @property string                          $coordinate
 * @property string                          $guild_id
 * @property string                          $channel_id
 * @property string                          $players
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereChannelId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereCoordinate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereGuildId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat wherePlayers($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereUpdatedAt($value)
 * @mixin \Eloquent
 * @property string $from
 * @property int $count
 * @property-read mixed $guild_name
 * @property-read \App\Guild $guild
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereCount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereFrom($value)
 * @property string $region
 * @property string $gamemode
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereGamemode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Boat whereRegion($value)
 */
class Boat extends Model
{
    use HasGuild;
    //
    protected $with = ['guild'];
    protected $guarded = [];
}
