<?php
/**
 * Shyam Game - User Registration API
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse(false, 'Invalid request method.', null, 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$name = sanitizeInput($input['name'] ?? '');
$username = sanitizeInput($input['username'] ?? '');
$password = $input['password'] ?? '';
$email = sanitizeInput($input['email'] ?? '');
$phone = sanitizeInput($input['phone'] ?? '');
$role = sanitizeInput($input['role'] ?? 'User'); // User, Retailer, Distributer, SuperDistributer
$parentId = !empty($input['parent_id']) ? (int)$input['parent_id'] : null;

if (empty($name) || empty($username) || empty($password)) {
    sendJSONResponse(false, 'Full Name, Username and Password are required.');
}

if (strlen($password) < 6) {
    sendJSONResponse(false, 'Password must be at least 6 characters long.');
}

try {
    $db = Database::getConnection();

    // Check duplicate username
    $checkStmt = $db->prepare("SELECT id FROM users WHERE username = :username LIMIT 1");
    $checkStmt->execute(['username' => $username]);
    if ($checkStmt->fetch()) {
        sendJSONResponse(false, 'Username is already taken. Please choose another.');
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);

    $db->beginTransaction();

    $stmt = $db->prepare("
        INSERT INTO users (name, username, password, email, phone, role, parent_id, status)
        VALUES (:name, :username, :password, :email, :phone, :role, :parent_id, 'active')
    ");
    $stmt->execute([
        'name' => $name,
        'username' => $username,
        'password' => $hashedPassword,
        'email' => $email,
        'phone' => $phone,
        'role' => $role,
        'parent_id' => $parentId
    ]);

    $userId = $db->lastInsertId();

    // Initialize Wallet
    $walletStmt = $db->prepare("INSERT INTO wallet (user_id, balance) VALUES (:user_id, 1000.00)");
    $walletStmt->execute(['user_id' => $userId]);

    // Initial Bonus Transaction
    $txnStmt = $db->prepare("
        INSERT INTO transactions (ref_id, user_id, from_user, to_user, type, amount, balance_after, remark)
        VALUES (:ref_id, :user_id, 'System', :username, 'Credit', 1000.00, 1000.00, 'Welcome Sign-up Bonus Points')
    ");
    $txnStmt->execute([
        'ref_id' => 'REF-' . rand(100000, 999999),
        'user_id' => $userId,
        'username' => $username
    ]);

    $db->commit();

    sendJSONResponse(true, 'Account registered successfully with 1,000 welcome points!', [
        'id' => $userId,
        'username' => $username,
        'name' => $name,
        'role' => $role,
        'balance' => 1000.00
    ]);

} catch (Exception $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    sendJSONResponse(false, 'Registration failed: ' . $e->getMessage(), null, 500);
}
