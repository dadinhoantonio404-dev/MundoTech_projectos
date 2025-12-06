<?php
require __DIR__ . '/db_config.php';

$conn->query("CREATE TABLE IF NOT EXISTS clubes (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(100) NOT NULL, municipio VARCHAR(100) NOT NULL, UNIQUE KEY uk_municipio (municipio)) ENGINE=InnoDB;");

$conn->query("CREATE TABLE IF NOT EXISTS atletas (id INT AUTO_INCREMENT PRIMARY KEY, nome VARCHAR(255) NOT NULL, data_nasc DATE NOT NULL, morada VARCHAR(100) NOT NULL, categoria VARCHAR(20) NOT NULL, clube_id INT NOT NULL, CONSTRAINT fk_clube FOREIGN KEY (clube_id) REFERENCES clubes(id) ON UPDATE CASCADE ON DELETE RESTRICT) ENGINE=InnoDB;");

$clubes = [
    ['Clube Horizonte', 'Luanda'],
    ['Clube Atlântico', 'Belas'],
    ['Clube Kilamba', 'Kilamba Kiaxi'],
    ['Clube Viana', 'Viana'],
    ['Clube Cazenga', 'Cazenga'],
    ['Clube Cacuaco', 'Cacuaco'],
    ['Clube Icolo e Bengo', 'Icolo e Bengo'],
    ['Clube Quiçama', 'Quiçama'],
    ['Clube Talatona', 'Talatona'],
    ['Clube Samba', 'Samba'],
];

$stmt = $conn->prepare("INSERT IGNORE INTO clubes (nome, municipio) VALUES (?, ?)");
foreach ($clubes as [$nome, $municipio]) {
    $stmt->bind_param('ss', $nome, $municipio);
    $stmt->execute();
}

echo "OK";
