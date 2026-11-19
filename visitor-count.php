<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); header('Allow: GET'); echo json_encode(['error'=>'Method not allowed']); exit; }
// Only a numeric total is stored. No IP addresses, user agents or visitor identifiers are logged by this script.
// Place the data file outside public_html. A successful visitor cookie limits repeat counting for 24 hours.
$store = dirname(__DIR__) . '/agnex-visitor-count.txt';
$alreadyCounted = isset($_COOKIE['agnex_visit']) && $_COOKIE['agnex_visit'] === '1';
$handle = @fopen($store, 'c+');
if ($handle === false || !flock($handle, LOCK_EX)) { http_response_code(503); echo json_encode(['error'=>'Counter unavailable']); exit; }
rewind($handle);
$raw = trim((string)stream_get_contents($handle));
$count = ctype_digit($raw) ? (int)$raw : 0;
if (!$alreadyCounted) {
    $count++;
    rewind($handle);
    $ok = ftruncate($handle, 0) && fwrite($handle, (string)$count) !== false && fflush($handle);
    if (!$ok) { flock($handle, LOCK_UN); fclose($handle); http_response_code(503); echo json_encode(['error'=>'Counter unavailable']); exit; }
    setcookie('agnex_visit', '1', ['expires'=>time()+86400,'path'=>'/','secure'=>!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=='off','httponly'=>true,'samesite'=>'Lax']);
}
flock($handle, LOCK_UN);
fclose($handle);
echo json_encode(['visits'=>$count]);
