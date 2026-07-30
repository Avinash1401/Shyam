<?php
/**
 * Shyam Game - Database Connection Manager (PDO + Prepared Statements)
 * Core PHP 8
 */

require_once __DIR__ . '/config.php';

class Database {
    private static ?PDO $instance = null;

    public static function getConnection(): PDO {
        if (self::$instance === null) {
            try {
                $dsn = sprintf("mysql:host=%s;dbname=%s;charset=%s", DB_HOST, DB_NAME, DB_CHARSET);
                $options = [
                    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES   => false,
                ];
                self::$instance = new PDO($dsn, DB_USER, DB_PASS, $options);
            } catch (PDOException $e) {
                // Log error safely without exposing raw credentials
                error_log("Database Connection Error: " . $e->getMessage());
                die(json_encode([
                    'success' => false,
                    'message' => 'Database connection failed. Please ensure MySQL is active.'
                ]));
            }
        }
        return self::$instance;
    }
}
