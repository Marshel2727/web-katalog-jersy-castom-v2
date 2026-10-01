<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'tagline', 'whatsapp', 'logo_path', 'instagram_url', 'tiktok_url'])]
class SiteSetting extends Model {}
