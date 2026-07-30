<?php
/**
 * Shyam Game - Wallet Balance & Transactions REST API
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$userId = $_SESSION['user_id'] ?? ($_GET['user_id'] ?? null);

if (!$userId) {
    sendJSONResponse(false, 'Unauthorized. Session or user_id required.', null, 401);
}

try {
    $db = Database::getConnection();

    $action = $_GET['action'] ?? 'balance';

    if ($action === 'balance') {
        $stmt = $db->prepare("
            SELECT u.id, u.username, u.name, u.role, w.balance 
            FROM users u 
            JOIN wallet w ON u.id = w.user_id 
            WHERE u.id = :user_id LIMIT 1
        ");
        $stmt->execute(['user_id' => $userId]);
        $data = $stmt->fetch();

        if (!$data) {
            sendJSONResponse(false, 'User wallet not found.');
        }

        sendJSONResponse(true, 'Wallet retrieved successfully.', [
            'user_id' => $data['id'],
            'username' => $data['username'],
            'name' => $data['name'],
            'role' => $data['role'],
            'balance' => (float)$data['balance']
        ]);
    } else if ($action === 'transfer') {
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $targetUsername = sanitizeInput($input['target_username'] ?? '');
        $amount = (float)($input['amount'] ?? 0);
        $type = sanitizeInput($input['type'] ?? 'Credit'); // Credit or Debit
        $remark = sanitizeInput($input['remark'] ?? 'Points Transfer');

        if ($amount <= 0 || empty($targetUsername)) {
            sendJSONResponse(false, 'Invalid target username or transfer amount.');
        }

        $db->beginTransaction();

        // Get target user
        $targetStmt = $db->prepare("
            SELECT u.id, u.username, w.balance 
            FROM users u 
            JOIN wallet w ON u.id = w.user_id 
            WHERE u.username = :username LIMIT 1 FOR UPDATE
        ");
        $targetStmt->execute(['username' => $targetUsername]);
        $target = $targetStmt->fetch();

        if (!$target) {
            $db->rollBack();
            sendJSONResponse(false, 'Target account not found.');
        }

        $currentBalance = (float)$target['balance'];

        if ($type === 'Debit' && $currentBalance < $amount) {
            $db->rollBack();
            sendJSONResponse(false, 'Insufficient balance in target wallet.');
        }

        $newBalance = ($type === 'Credit') ? $currentBalance + $amount : $currentBalance - $amount;

        $updateStmt = $db->prepare("UPDATE wallet SET balance = :balance WHERE user_id = :user_id");
        $updateStmt->execute(['balance' => $newBalance, 'user_id' => $target['id']]);

        // Insert Transaction Log
        $txnStmt = $db->prepare("
            INSERT INTO transactions (ref_id, user_id, from_user, to_user, type, amount, balance_after, remark)
            VALUES (:ref_id, :user_id, 'Admin/Distributor', :to_user, :type, :amount, :balance_after, :remark)
        ");
        $txnStmt->execute([
            'ref_id' => 'REF-' . rand(100000, 999999),
            'user_id' => $target['id'],
            'to_user' => $target['username'],
            'type' => $type,
            'amount' => $amount,
            'balance_after' => $newBalance,
            'remark' => $remark
        ]);

        $db->commit();

        sendJSONResponse(true, "Successfully {$type}ed {$amount} points for {$targetUsername}.", [
            'new_balance' => $newBalance
        ]);
    }
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    sendJSONResponse(false, 'Wallet error: ' . $e->getMessage(), null, 500);
}
