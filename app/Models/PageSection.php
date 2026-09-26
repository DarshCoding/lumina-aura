<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'page',
        'section_key',
        'label',
        'eyebrow',
        'title',
        'body',
        'body_secondary',
        'image_url',
        'cta_label',
        'cta_href',
        'cta_secondary_label',
        'cta_secondary_href',
        'meta',
        'sort_order',
    ];

    protected $casts = [
        'meta' => 'array',
        'sort_order' => 'integer',
    ];

    public function toApiArray(): array
    {
        return [
            'id' => $this->id,
            'page' => $this->page,
            'sectionKey' => $this->section_key,
            'label' => $this->label,
            'eyebrow' => $this->eyebrow,
            'title' => $this->title,
            'body' => $this->body,
            'bodySecondary' => $this->body_secondary,
            'imageUrl' => $this->image_url,
            'ctaLabel' => $this->cta_label,
            'ctaHref' => $this->cta_href,
            'ctaSecondaryLabel' => $this->cta_secondary_label,
            'ctaSecondaryHref' => $this->cta_secondary_href,
            'meta' => $this->meta ?? [],
            'sortOrder' => (int) $this->sort_order,
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
