<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Auth::routes();
Route::get('/', 'LandingController@index')->name('home');
Route::get('/home', 'HomeController@index')->name('home');
Route::get('/test', 'SourceQueryController@test')->name('test');
Route::get('/get', 'HomeController@get')->name('get');

Route::group(['middleware' => ['permission:a.update']], function () {
    Route::resource('update', 'UpdateController');
    Route::get('update/get/destroy', 'UpdateController@destroy')->name('update.get.destroy');
});

Route::group(['middleware' => ['permission:a.faq']], function () {
    Route::resource('faq', 'FaqController');
    Route::get('faq/get/destroy', 'FaqController@destroy')->name('faq.get.destroy');
});

Route::group(['middleware' => ['permission:a.faq']], function () {
    Route::resource('announcement', 'AnnouncementController');
});

Route::group(['middleware' => ['permission:a.update']], function () {
    Route::resource('command', 'CommandController');
});

Route::group(['middleware' => ['permission:a.ping']], function () {
    Route::resource('ping', 'PingController');
});

Route::group(['middleware' => ['permission:a.playerping']], function () {
    Route::resource('playerping', 'PlayerPingController');
});

Route::group(['middleware' => ['permission:a.playertrack']], function () {
    Route::resource('playertrack', 'PlayerTrackController');
});

Route::group(['middleware' => ['permission:a.linkclick']], function () {
    Route::resource('linkclick', 'LinkClickController');
});

Route::group(['middleware' => ['permission:a.proximitytrack']], function () {
    Route::resource('proximitytrack', 'ProximityTrackController');
});

Route::group(['middleware' => ['permission:a.boat']], function () {
    Route::resource('boat', 'BoatController');
});

Route::group(['middleware' => ['permission:a.guild']], function () {
    Route::resource('guild', 'GuildController');
});

Route::group(['middleware' => ['permission:u.apikey']], function () {
    Route::resource('apikey', 'ApiKeyController');
    Route::get('apikey/get/destroy', 'ApiKeyController@destroy')->name('apikey.get.destroy');
});
Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
