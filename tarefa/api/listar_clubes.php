<?php
header('Content-Type: application/json');
require __DIR__ . '/../db_config.php';

$sql = "SELECT c.id, c.nome, c.municipio, COUNT(a.id) AS atletas_count FROM clubes c LEFT JOIN atletas a ON a.clube_id = c.id GROUP BY c.id ORDER BY c.id ASC";
$res = $conn->query($sql);

$out = [];
while ($row = $res->fetch_assoc()) {
    $out[] = $row;
}

echo json_encode($out);
