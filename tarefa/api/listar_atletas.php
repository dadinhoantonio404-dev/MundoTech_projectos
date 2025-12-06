<?php
header('Content-Type: application/json');
require __DIR__ . '/../db_config.php';

$sql = "SELECT a.id, a.nome, a.data_nasc, a.morada, a.categoria, c.nome AS clube_nome FROM atletas a JOIN clubes c ON c.id = a.clube_id ORDER BY a.id DESC";
$res = $conn->query($sql);

$out = [];
while ($row = $res->fetch_assoc()) {
    $out[] = $row;
}

echo json_encode($out);
