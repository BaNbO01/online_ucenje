<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategorijaController;
use App\Http\Controllers\KursController;
use App\Http\Controllers\CasController;
use App\Http\Controllers\MaterijalController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {

    Route::delete('/kursevi/{id}', [KursController::class, 'destroy']);
    
    Route::post('/kursevi',[KursController::class,'store']);
    Route::get('/kursevi', [KursController::class, 'getKursevi']);
    Route::get('kursevi/{id}', [KursController::class, 'show']);

    Route::delete('/casovi/{id}', [CasController::class, 'destroy']);
    Route::get('/casovi/{id}', [CasController::class, 'show']);
    Route::post('/casovi', [CasController::class, 'store']);

    Route::delete('/materijali/{id}', [MaterijalController::class, 'delete']);
    Route::get('/materijal/video/{id}', [MaterijalController::class, 'getVideo'])->name('materijal.video');
    Route::post('materijali',[MaterijalController::class,'store']);

    Route::delete('users/{id}', [UserController::class, 'destroy']);
    Route::get('/users/omiljeni-kursevi', [UserController::class, 'getOmiljeniKursevi']);
    Route::get('/users/moji-kursevi', [UserController::class, 'mojiKursevi']);
    Route::get('users/nastavnici', [UserController::class, 'getTeachers']);
    Route::get('users/studenti', [UserController::class, 'getStudents']);

    Route::get('/kategorije',[KategorijaController::class,'index']);
    Route::post('/kategorije',[KategorijaController::class,'store']);


});

