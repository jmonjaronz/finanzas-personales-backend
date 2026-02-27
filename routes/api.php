use App\Http\Controllers\TransaccionController;

Route::prefix('finanzas')->group(function () {
    Route::post('/ingreso', [TransaccionController::class, 'ingreso']);
    Route::post('/gasto', [TransaccionController::class, 'gasto']);
    Route::post('/transferencia', [TransaccionController::class, 'transferencia']);
});