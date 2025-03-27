    const users = {};

document.getElementById('loginButton').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username]) {
        if (users[username].password === password) {
            alert('Inicio de sesión exitoso');
            showMenu();
        } else {
            alert('Contraseña incorrecta');
        }
    } else {
        users[username] = { password: password, scores: [] };
        alert('Usuario registrado exitosamente');
        showMenu();
    }
});

function showMenu() {
    document.getElementById('login').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
}

document.getElementById('playButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('gameModes').style.display = 'block';
});

document.getElementById('scoreboardButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('scoreboardModes').style.display = 'block';
});

document.getElementById('backButton').addEventListener('click', () => {
    document.getElementById('scoreboard').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
});

document.getElementById('logoutButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('login').style.display = 'block';
});

let score = 0;
let time = 60;
let interval;

function startGameWithMode(selectedTime) {
    score = 0;
    time = selectedTime;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = time;
    generateTargets();
    interval = setInterval(() => {
        time--;
        document.getElementById('time').textContent = time;
        if (time <= 0) {
            clearInterval(interval);
            alert('Tiempo terminado! Puntuación: ' + score);
            saveScore(score, selectedTime + 's');
            document.getElementById('game').style.display = 'none';
            showMenu();
        }
    }, 1000);

    const grid = document.getElementById('grid');
    const clickHandler = (e) => {
        if (!e.target.classList.contains('target')) {
            score -= 0.5;
            document.getElementById('score').textContent = score;
        }
    };
    grid.addEventListener('click', clickHandler);

    setTimeout(() => {
        grid.removeEventListener('click', clickHandler);
    }, selectedTime * 1000);
}

function generateTargets() {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        grid.appendChild(cell);
    }
    for (let i = 0; i < 3; i++) {
        addTarget();
    }
}

function addTarget() {
    const grid = document.getElementById('grid');
    const target = document.createElement('div');
    target.classList.add('target');
    target.style.width = '100%';
    target.style.height = '100%';
    target.addEventListener('click', () => {
        score++;
        document.getElementById('score').textContent = score;
        target.remove();
        setTimeout(() => {
            addTarget();
        }, 200);
    });
    let randomCell;
    do {
        randomCell = grid.children[Math.floor(Math.random() * 9)];
    } while (randomCell.children.length > 0);
    randomCell.appendChild(target);
}

document.getElementById('grid').addEventListener('click', (e) => {
    if (!e.target.classList.contains('target')) {
        score -= 0.5;
        document.getElementById('score').textContent = score;
    }
});

function saveScore(score, mode) {
    const username = document.getElementById('username').value;
    const date = new Date().toISOString().split('T')[0];
    const accuracy = ((score / (score + 0.5 * (60 - time))) * 100).toFixed(2) + '%';

    if (users[username]) {
        if (!users[username].scores[mode]) {
            users[username].scores[mode] = [];
        }
        users[username].scores[mode].push({ date: date, score: score, accuracy: accuracy });
    }

    fetch('save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: users[username].password,
            date: date,
            score: score,
            accuracy: accuracy,
            mode: mode
        })
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

function showScoreboard(mode) {
    let scores = [];
    for (const user in users) {
        if (users[user].scores[mode]) {
            users[user].scores[mode].forEach(s => {
                scores.push({ username: user, ...s });
            });
        }
    }

    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, 10);

    let scoreboardContent = '<table><tr><th>Usuario</th><th>Fecha</th><th>Puntuación</th><th>Precisión</th></tr>';
    scores.forEach(s => {
        scoreboardContent += `<tr><td>${s.username}</td><td>${s.date}</td><td>${s.score}</td><td>${s.accuracy}</td></tr>`;
    });
    scoreboardContent += '</table>';

    document.getElementById('scoreboardContent').innerHTML = scoreboardContent;
    document.getElementById('scoreboard').style.display = 'block';
    document.getElementById('scoreboardModes').style.display = 'none';
}

document.getElementById('toggleModeButton').addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

document.getElementById('viewUsersButton').addEventListener('click', () => {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('connectedUsers').style.display = 'block';
    showLoggedUsers();
});

document.getElementById('backFromUsersButton').addEventListener('click', () => {
    document.getElementById('connectedUsers').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
});

function showLoggedUsers() {
    let userList = '<ul>';
    for (const user in users) {
        userList += `<li>${user}</li>`;
    }
    userList += '</ul>';
    document.getElementById('connectedUsersContent').innerHTML = userList;
}

document.getElementById('backFromModesButton').addEventListener('click', () => {
    document.getElementById('gameModes').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
});

document.getElementById('mode10s').addEventListener('click', () => {
    document.getElementById('gameModes').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startGameWithMode(10);
});

document.getElementById('mode30s').addEventListener('click', () => {
    document.getElementById('gameModes').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startGameWithMode(30);
});

document.getElementById('mode60s').addEventListener('click', () => {
    document.getElementById('gameModes').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startGameWithMode(60);
});

document.getElementById('modeOneShot').addEventListener('click', () => {
    document.getElementById('gameModes').style.display = 'none';
    document.getElementById('game').style.display = 'block';
    startOneShotMode();
});

function startOneShotMode() {
    score = 0;
    let gameEnded = false;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = '∞';
    generateTargets();
    const grid = document.getElementById('grid');
    const clickHandler = (e) => {
        if (!e.target.classList.contains('target') && !gameEnded) {
            gameEnded = true;
            clearInterval(interval);
            alert('¡Fallaste! Puntuación: ' + score);
            saveScore(score, 'osok');
            grid.removeEventListener('click', clickHandler);
            document.getElementById('game').style.display = 'none';
            showMenu();
        }
    };
    grid.addEventListener('click', clickHandler);
}

document.getElementById('scoreMode10s').addEventListener('click', () => {
    showScoreboard('10s');
});

document.getElementById('scoreMode30s').addEventListener('click', () => {
    showScoreboard('30s');
});

document.getElementById('scoreMode60s').addEventListener('click', () => {
    showScoreboard('60s');
});

document.getElementById('scoreModeOneShot').addEventListener('click', () => {
    showScoreboard('osok');
});

document.getElementById('backFromScoreModesButton').addEventListener('click', () => {
    document.getElementById('scoreboardModes').style.display = 'none';
    document.getElementById('menu').style.display = 'block';
});

window.addEventListener('load', () => {
    document.getElementById('login').style.display = 'block';
}); 