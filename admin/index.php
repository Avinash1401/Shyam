<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shyam Panel - Master Gaming Admin</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- FontAwesome & Feather Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background-color: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .bg-slate-900 { background-color: #1e293b !important; }
        .bg-slate-950 { background-color: #020617 !important; }
        .border-slate-800 { border-color: #334155 !important; }
        .card-custom { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
        .text-cyan { color: #06b6d4; }
        .btn-cyan { background-color: #0891b2; color: #ffffff; border: none; font-weight: 600; }
        .btn-cyan:hover { background-color: #06b6d4; color: #ffffff; }
    </style>
</head>
<body>
    <div class="container-fluid py-4">
        <header class="d-flex justify-content-between align-items-center pb-3 mb-4 border-bottom border-slate-800">
            <div class="d-flex align-items-center gap-2">
                <i class="fa-solid fa-gamepad text-cyan fs-2"></i>
                <h2 class="h4 mb-0 font-weight-bold text-white tracking-wider">SHYAM PANEL ADMIN</h2>
            </div>
            <div>
                <span class="badge bg-success px-3 py-2">PHP 8 + MySQL Backend</span>
            </div>
        </header>

        <div class="row g-3 mb-4">
            <div class="col-md-3">
                <div class="card-custom p-3">
                    <div class="text-muted small text-uppercase">Total Turn Over</div>
                    <div class="h3 font-weight-bold text-cyan mt-1">₹4,890,200.00</div>
                    <div class="small text-success"><i class="fa-solid fa-arrow-trend-up"></i> +14.2% today</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card-custom p-3">
                    <div class="text-muted small text-uppercase">Net House Profit</div>
                    <div class="h3 font-weight-bold text-success mt-1">₹892,150.00</div>
                    <div class="small text-muted">18.2% House Margin</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card-custom p-3">
                    <div class="text-muted small text-uppercase">Online Players</div>
                    <div class="h3 font-weight-bold text-warning mt-1">1,248</div>
                    <div class="small text-warning"><i class="fa-solid fa-signal"></i> Active session</div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card-custom p-3">
                    <div class="text-muted small text-uppercase">Total Tickets Today</div>
                    <div class="h3 font-weight-bold text-info mt-1">18,940</div>
                    <div class="small text-muted">across 3 games</div>
                </div>
            </div>
        </div>

        <div class="card-custom p-4">
            <h5 class="text-cyan mb-3"><i class="fa-solid fa-table-list"></i> System Management Overview</h5>
            <p class="text-secondary">Core PHP 8 Admin Module. Database connection verified on MySQL schema <code>shyam_game.sql</code>.</p>
            <div class="table-responsive">
                <table class="table table-dark table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>API Route</th>
                            <th>Method</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td>Authentication</td><td><code>/api/login.php</code></td><td><span class="badge bg-primary">POST</span></td><td><span class="badge bg-success">Active</span></td></tr>
                        <tr><td>Registration</td><td><code>/api/register.php</code></td><td><span class="badge bg-primary">POST</span></td><td><span class="badge bg-success">Active</span></td></tr>
                        <tr><td>Wallet Management</td><td><code>/api/wallet.php</code></td><td><span class="badge bg-info">GET / POST</span></td><td><span class="badge bg-success">Active</span></td></tr>
                        <tr><td>Wager Engine</td><td><code>/api/place_bet.php</code></td><td><span class="badge bg-primary">POST</span></td><td><span class="badge bg-success">Active</span></td></tr>
                        <tr><td>Result Declaration</td><td><code>/api/game_result.php</code></td><td><span class="badge bg-info">GET / POST</span></td><td><span class="badge bg-success">Active</span></td></tr>
                        <tr><td>History & Audit</td><td><code>/api/history.php</code></td><td><span class="badge bg-info">GET</span></td><td><span class="badge bg-success">Active</span></td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
