<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Image extends Model {
    use HasFactory;

    protected $fillable = array('user_id', 'document_id', 'name', 'last_viewed_at');

    public function user(): BelongsTo {
        return $this->belongsTo(Document::class);
    }

    public function document(): BelongsTo {
        return $this->belongsTo(Document::class);
    }
}
