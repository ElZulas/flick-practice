<?php
$data = json_decode(file_get_contents('php://input'), true);
$file = 'scores.json';

// Leer el archivo JSON existente
$scores = json_decode(file_get_contents($file), true);

// Si el usuario no existe, inicializar su entrada
if (!isset($scores[$data['username']])) {
    $scores[$data['username']] = [
        'password' => $data['password'],
        'scores' => []
    ];
}

// Agregar el nuevo puntaje al modo correspondiente
if (!isset($scores[$data['username']]['scores'][$data['mode']])) {
    $scores[$data['username']]['scores'][$data['mode']] = [];
}

$scores[$data['username']]['scores'][$data['mode']][] = [
    'date' => $data['date'],
    'score' => $data['score'],
    'accuracy' => $data['accuracy']
];

// Guardar los datos actualizados en el archivo JSON
file_put_contents($file, json_encode($scores));

echo 'Puntuación guardada exitosamente';
?> 