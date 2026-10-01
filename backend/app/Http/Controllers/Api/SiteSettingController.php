<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SiteSetting\UpdateSiteSettingRequest;
use App\Http\Resources\SiteSettingResource;
use App\Models\SiteSetting;
use App\Services\SiteSettingService;

class SiteSettingController extends Controller
{
    public function show(): SiteSettingResource
    {
        return new SiteSettingResource(SiteSetting::findOrFail(1));
    }

    public function update(UpdateSiteSettingRequest $request, SiteSettingService $service): SiteSettingResource
    {
        return new SiteSettingResource($service->update($request->validated()));
    }
}
