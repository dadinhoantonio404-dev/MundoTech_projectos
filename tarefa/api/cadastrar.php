<?php
header('Content-Type: application/json');
require __DIR__ . '/../db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$nome = trim($input['nome'] ?? '');
$dataStr = trim($input['data_nasc'] ?? '');
$morada = trim($input['morada'] ?? '');

if ($nome === '' || $dataStr === '' || $morada === '') {
    echo json_encode(['error' => 'Dados obrigatórios em falta']);
    exit;
}

$birthDate = DateTime::createFromFormat('d/m/Y', $dataStr);
$errors = DateTime::getLastErrors();
if (!$birthDate || $errors['warning_count'] > 0 || $errors['error_count'] > 0) {
    echo json_encode(['error' => 'Data inválida']);
    exit;
}

$today = new DateTime('today');
$age = $birthDate->diff($today)->y;

if ($age >= 7 && $age <= 11) {
    $categoria = 'Infantil';
} elseif ($age >= 12 && $age <= 17) {
    $categoria = 'Júnior';
} elseif ($age >= 18 && $age <= 29) {
    $categoria = 'Sênior';
} else {
    echo json_encode(['error' => 'Idade fora das faixas válidas']);
    exit;
}

$dataISO = $birthDate->format('Y-m-d');

$clubeId = null;

$stmt = $conn->prepare("SELECT id FROM clubes WHERE municipio = ? LIMIT 1");
$stmt->bind_param('s', $morada);
$stmt->execute();
$res = $stmt->get_result();
if ($row = $res->fetch_assoc()) {
    $idMunicipio = (int)$row['id'];
    $countStmt = $conn->prepare("SELECT COUNT(*) AS qtd FROM atletas WHERE clube_id = ?");
    $countStmt->bind_param('i', $idMunicipio);
    $countStmt->execute();
    $qtd = (int)$countStmt->get_result()->fetch_assoc()['qtd'];
    if ($qtd < 25) {
        $clubeId = $idMunicipio;
    }
}

if (!$clubeId) {
    $sql = "SELECT c.id, COUNT(a.id) AS qtd FROM clubes c LEFT JOIN atletas a ON a.clube_id = c.id GROUP BY c.id HAVING qtd < 25 ORDER BY c.id ASC LIMIT 1";
    $res2 = $conn->query($sql);
    if ($row2 = $res2->fetch_assoc()) {
        $clubeId = (int)$row2['id'];
    }
}

if (!$clubeId) {
    echo json_encode(['error' => 'Não há vagas disponíveis no momento']);
    exit;
}

$ins = $conn->prepare("INSERT INTO atletas (nome, data_nasc, morada, categoria, clube_id) VALUES (?, ?, ?, ?, ?)");
$ins->bind_param('ssssi', $nome, $dataISO, $morada, $categoria, $clubeId);
$ins->execute();

echo json_encode(['success' => true]);
