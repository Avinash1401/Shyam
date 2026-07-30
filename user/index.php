<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shyam Game - Player Gaming Portal</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        body { background: #020617; color: #f1f5f9; font-family: 'Segoe UI', system-ui, sans-serif; }
        .game-card { background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; transition: transform 0.2s; }
        .game-card:hover { transform: translateY(-4px); border-color: #06b6d4; }
        .badge-cyan { background-color: rgba(6, 182, 212, 0.15); color: #22d3ee; border: 1px solid rgba(6, 182, 212, 0.3); }
        .timer-box { font-family: monospace; font-size: 1.5rem; color: #38bdf8; font-weight: 700; }
    </style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-slate-900 border-bottom border-slate-800 px-3">
        <a class="navbar-brand font-weight-bold text-cyan" href="#"><i class="fa-solid fa-gamepad"></i> SHYAM GAME</a>
        <div class="ms-auto d-flex align-items-center gap-3">
            <div class="bg-slate-950 px-3 py-1.5 rounded-pill border border-slate-800">
                <small class="text-muted">Wallet Balance:</small>
                <strong class="text-success ms-1" id="walletBalance">₹25,000.00</strong>
            </div>
            <button class="btn btn-outline-danger btn-sm"><i class="fa-solid fa-sign-out-alt"></i> Logout</button>
        </div>
    </nav>

    <div class="container py-4">
        <div class="text-center mb-4">
            <h1 class="h3 font-weight-bold text-white">Choose Your Game</h1>
            <p class="text-secondary">Original Number Selection, 3D Prediction & Lucky 12 Games</p>
        </div>

        <div class="row g-4">
            <!-- Game 1 -->
            <div class="col-md-4">
                <div class="game-card p-4 text-center">
                    <div class="badge badge-cyan mb-2">2D Number Selection</div>
                    <h3 class="h5 font-weight-bold text-white">Number Selection Game</h3>
                    <p class="small text-muted mb-3">Select numbers from 00 to 99 with 90x payout multiplier</p>
                    <div class="timer-box mb-3" id="timer2D">02:45</div>
                    <button class="btn btn-cyan w-100 py-2"><i class="fa-solid fa-play me-1"></i> Play 2D Game</button>
                </div>
            </div>

            <!-- Game 2 -->
            <div class="col-md-4">
                <div class="game-card p-4 text-center">
                    <div class="badge bg-purple-950 text-purple-300 border border-purple-800 mb-2">3D Prediction</div>
                    <h3 class="h5 font-weight-bold text-white">3-Digit Prediction Game</h3>
                    <p class="small text-muted mb-3">Predict exact 3-digit combination (000 to 999) for 900x win</p>
                    <div class="timer-box mb-3" id="timer3D">01:12</div>
                    <button class="btn btn-cyan w-100 py-2"><i class="fa-solid fa-play me-1"></i> Play 3D Game</button>
                </div>
            </div>

            <!-- Game 3 -->
            <div class="col-md-4">
                <div class="game-card p-4 text-center">
                    <div class="badge bg-amber-950 text-amber-300 border border-amber-800 mb-2">Lucky 12 Selection</div>
                    <h3 class="h5 font-weight-bold text-white">Lucky Selection Game</h3>
                    <p class="small text-muted mb-3">Select from 12 lucky symbols and cards for instant 10x multiplier</p>
                    <div class="timer-box mb-3" id="timerL12">00:38</div>
                    <button class="btn btn-cyan w-100 py-2"><i class="fa-solid fa-play me-1"></i> Play Lucky 12</button>
                </div>
            </div>
        </div>
    </div>

    <!-- jQuery + Bootstrap 5 JS -->
    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
