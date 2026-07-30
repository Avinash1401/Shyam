<?php
/**
 * Shyam Game - Bet & Transaction History REST API
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$userId = (int)($_GET['user_id'] ?? ($_SESSION['user_id'] ?? 0));
$type = sanitizeInput($_GET['type'] ?? 'bets'); // 'bets' or 'transactions'

try {
    $db = Database::getConnection();

    if ($type === 'bets') {
        $sql = "
            SELECT b.id, b.ticket_no, u.username, g.name AS game_name, b.draw_number, b.selected_numbers, b.bet_amount, b.win_amount, b.status, b.created_at
            FROM bets b
            JOIN users u ON b.user_id = u.id
            JOIN games g ON b.game_id = g.id
        ";

        if ($userId > 0) {
            $sql .= " WHERE b.user_id = :user_id";
        }

        $sql .= " ORDER BY b.id DESC LIMIT 50";

        $stmt = $db->prepare($sql);
        if ($userId > 0) {
            $stmt->execute(['user_id' => $userId]);
        } else {
            $stmt->execute();
        }

        $bets = $stmt->fetchAll();
        sendJSONResponse(true, 'Bet history retrieved.', $bets);

    } else if ($type === 'transactions') {
        $sql = "
            SELECT t.id, t.ref_id, t.from_user, t.to_user, t.type, t.amount, t.balance_after, t.remark, t.created_at
            FROM transactions t
        ";

        if ($userId > 0) {
            $sql .= " WHERE t.user_id = :user_id";
        }

        $sql .= " ORDER BY t.id DESC LIMIT 50";

        $stmt = $db->prepare($sql);
        if ($userId > 0) {
            $stmt->execute(['user_id' => $userId]);
        } else {
            $stmt->execute();
        }

        $txns = $stmt->fetchAll();
        sendJSONResponse(true, 'Transaction history retrieved.', $txns);
    }
} catch (Exception $e) {
    sendJSONResponse(false, 'History API error: ' . $e->getMessage(), null, 500);
}
