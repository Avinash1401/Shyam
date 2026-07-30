<?php
/**
 * Shyam Game - Place Bet REST API
 * Handles wagers for 2D Lottery, 3D Lottery, and Lucky 12
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse(false, 'Invalid request method.', null, 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$userId = (int)($input['user_id'] ?? ($_SESSION['user_id'] ?? 0));
$gameCode = sanitizeInput($input['game_code'] ?? '2D_LOTTERY'); // 2D_LOTTERY, 3D_LOTTERY, LUCKY_12
$selectedNumbers = $input['selected_numbers'] ?? []; // e.g. ["89", "12"]
$betAmount = (float)($input['bet_amount'] ?? 0);
$drawNumber = sanitizeInput($input['draw_number'] ?? ('DRW-' . rand(1000, 9999)));

if ($userId <= 0) {
    sendJSONResponse(false, 'Valid user ID is required.');
}

if (empty($selectedNumbers) || !is_array($selectedNumbers)) {
    sendJSONResponse(false, 'Please select at least one number or card to bet.');
}

if ($betAmount <= 0) {
    sendJSONResponse(false, 'Bet amount must be greater than zero.');
}

try {
    $db = Database::getConnection();

    $db->beginTransaction();

    // 1. Get Game ID
    $gameStmt = $db->prepare("SELECT id, name FROM games WHERE code = :code AND status = 'active' LIMIT 1");
    $gameStmt->execute(['code' => $gameCode]);
    $game = $gameStmt->fetch();

    if (!$game) {
        $db->rollBack();
        sendJSONResponse(false, 'Game not found or inactive.');
    }

    // 2. Lock & Check User Wallet
    $walletStmt = $db->prepare("
        SELECT w.balance, u.username 
        FROM wallet w 
        JOIN users u ON w.user_id = u.id 
        WHERE w.user_id = :user_id FOR UPDATE
    ");
    $walletStmt->execute(['user_id' => $userId]);
    $wallet = $walletStmt->fetch();

    if (!$wallet) {
        $db->rollBack();
        sendJSONResponse(false, 'Wallet not found.');
    }

    $currentBalance = (float)$wallet['balance'];
    if ($currentBalance < $betAmount) {
        $db->rollBack();
        sendJSONResponse(false, "Insufficient balance. Your wallet has {$currentBalance} points.", null, 400);
    }

    // 3. Deduct Wallet
    $newBalance = $currentBalance - $betAmount;
    $updateWalletStmt = $db->prepare("UPDATE wallet SET balance = :balance WHERE user_id = :user_id");
    $updateWalletStmt->execute(['balance' => $newBalance, 'user_id' => $userId]);

    // 4. Create Ticket Record
    $ticketNo = 'SHM-' . date('Ymd') . '-' . rand(1000, 9999);
    $numbersString = implode(', ', array_map('sanitizeInput', $selectedNumbers));

    $betStmt = $db->prepare("
        INSERT INTO bets (ticket_no, user_id, game_id, draw_number, selected_numbers, bet_amount, status)
        VALUES (:ticket_no, :user_id, :game_id, :draw_number, :selected_numbers, :bet_amount, 'Pending')
    ");
    $betStmt->execute([
        'ticket_no' => $ticketNo,
        'user_id' => $userId,
        'game_id' => $game['id'],
        'draw_number' => $drawNumber,
        'selected_numbers' => $numbersString,
        'bet_amount' => $betAmount
    ]);

    $betId = $db->lastInsertId();

    // 5. Create Transaction Record
    $txnStmt = $db->prepare("
        INSERT INTO transactions (ref_id, user_id, from_user, to_user, type, amount, balance_after, remark)
        VALUES (:ref_id, :user_id, :username, 'Game System', 'Debit', :amount, :balance_after, :remark)
    ");
    $txnStmt->execute([
        'ref_id' => 'REF-' . rand(100000, 999999),
        'user_id' => $userId,
        'username' => $wallet['username'],
        'amount' => $betAmount,
        'balance_after' => $newBalance,
        'remark' => "Bet placed on {$game['name']} (Ticket #{$ticketNo})"
    ]);

    $db->commit();

    sendJSONResponse(true, 'Ticket generated successfully! Good luck!', [
        'ticket_id' => $betId,
        'ticket_no' => $ticketNo,
        'game' => $game['name'],
        'draw_number' => $drawNumber,
        'selected_numbers' => $numbersString,
        'bet_amount' => $betAmount,
        'new_balance' => $newBalance
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    sendJSONResponse(false, 'Betting error: ' . $e->getMessage(), null, 500);
}
