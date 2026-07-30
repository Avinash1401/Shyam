<?php
/**
 * Shyam Game - Game Result API
 * Fetches latest results and allows Admin to declare winning results
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = Database::getConnection();

    if ($method === 'GET') {
        $gameCode = sanitizeInput($_GET['game_code'] ?? '');

        $sql = "
            SELECT r.id, g.name AS game_name, g.code AS game_code, r.draw_number, r.winning_result, r.draw_time, r.total_bets, r.total_payout, r.status
            FROM results r
            JOIN games g ON r.game_id = g.id
        ";

        if (!empty($gameCode)) {
            $sql .= " WHERE g.code = :game_code";
        }

        $sql .= " ORDER BY r.id DESC LIMIT 20";

        $stmt = $db->prepare($sql);
        if (!empty($gameCode)) {
            $stmt->execute(['game_code' => $gameCode]);
        } else {
            $stmt->execute();
        }

        $results = $stmt->fetchAll();
        sendJSONResponse(true, 'Results retrieved.', $results);

    } else if ($method === 'POST') {
        // Declare result (Admin)
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

        $gameCode = sanitizeInput($input['game_code'] ?? '');
        $winningResult = sanitizeInput($input['winning_result'] ?? '');
        $drawNumber = sanitizeInput($input['draw_number'] ?? ('DRW-' . rand(1000, 9999)));

        if (empty($gameCode) || empty($winningResult)) {
            sendJSONResponse(false, 'Game code and winning result are required.');
        }

        $db->beginTransaction();

        $gameStmt = $db->prepare("SELECT id FROM games WHERE code = :code LIMIT 1");
        $gameStmt->execute(['code' => $gameCode]);
        $game = $gameStmt->fetch();

        if (!$game) {
            $db->rollBack();
            sendJSONResponse(false, 'Game not found.');
        }

        // Insert Result
        $resStmt = $db->prepare("
            INSERT INTO results (game_id, draw_number, winning_result, draw_time, total_bets, total_payout, status)
            VALUES (:game_id, :draw_number, :winning_result, NOW(), 25000.00, 18000.00, 'Declared')
        ");
        $resStmt->execute([
            'game_id' => $game['id'],
            'draw_number' => $drawNumber,
            'winning_result' => $winningResult
        ]);

        $db->commit();

        sendJSONResponse(true, "Winning result [{$winningResult}] declared successfully for draw {$drawNumber}.");
    }
} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    sendJSONResponse(false, 'Result API error: ' . $e->getMessage(), null, 500);
}
