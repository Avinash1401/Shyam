<?php
/**
 * Shyam Game - Authentication Login API
 * Supports User & Admin secure login
 */

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJSONResponse(false, 'Invalid request method.', null, 405);
}

$input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

$username = sanitizeInput($input['username'] ?? '');
$password = $input['password'] ?? '';
$userType = sanitizeInput($input['type'] ?? 'user'); // 'user' or 'admin'

if (empty($username) || empty($password)) {
    sendJSONResponse(false, 'Username and password are required.');
}

try {
    $db = Database::getConnection();

    if ($userType === 'admin') {
        $stmt = $db->prepare("SELECT id, username, password, role, security_pin FROM admins WHERE username = :username LIMIT 1");
        $stmt->execute(['username' => $username]);
        $admin = $stmt->fetch();

        if ($admin && password_verify($password, $admin['password'])) {
            $_SESSION['admin_id'] = $admin['id'];
            $_SESSION['admin_username'] = $admin['username'];
            $_SESSION['role'] = $admin['role'];

            sendJSONResponse(true, 'Admin login successful.', [
                'id' => $admin['id'],
                'username' => $admin['username'],
                'role' => $admin['role'],
                'token' => generateCSRFToken()
            ]);
        } else {
            sendJSONResponse(false, 'Invalid admin username or password.');
        }
    } else {
        $stmt = $db->prepare("
            SELECT u.id, u.name, u.username, u.password, u.role, u.status, u.commission_rate, w.balance
            FROM users u
            LEFT JOIN wallet w ON u.id = w.user_id
            WHERE u.username = :username LIMIT 1
        ");
        $stmt->execute(['username' => $username]);
        $user = $stmt->fetch();

        if (!$user) {
            sendJSONResponse(false, 'User account not found.');
        }

        if ($user['status'] !== 'active') {
            sendJSONResponse(false, 'Account is currently ' . $user['status'] . '. Contact your distributor.');
        }

        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['role'] = $user['role'];

            sendJSONResponse(true, 'User login successful.', [
                'id' => $user['id'],
                'name' => $user['name'],
                'username' => $user['username'],
                'role' => $user['role'],
                'balance' => (float)$user['balance'],
                'commission_rate' => (float)$user['commission_rate'],
                'token' => generateCSRFToken()
            ]);
        } else {
            sendJSONResponse(false, 'Invalid credentials.');
        }
    }
} catch (Exception $e) {
    sendJSONResponse(false, 'Login error: ' . $e->getMessage(), null, 500);
}
