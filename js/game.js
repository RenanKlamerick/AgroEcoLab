const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 40; // Tamanho de cada tile (quadrado)
const GRID_WIDTH = canvas.width / TILE_SIZE;
const GRID_HEIGHT = canvas.height / TILE_SIZE;

let gameMap = []; // Representa o mapa do jogo (grid)

// Definindo tipos de tiles
const TILE_TYPES = {
    SOIL: 0,
    PLANT: 1,
    WATER: 2
};

// Cores para os tiles
const TILE_COLORS = {
    [TILE_TYPES.SOIL]: '#8B4513', // Marrom do solo
    [TILE_TYPES.PLANT]: '#228B22', // Verde da planta
    [TILE_TYPES.WATER]: '#4682B4'  // Azul da água
};

function initGame() {
    // Inicializa o mapa com solo
    for (let y = 0; y < GRID_HEIGHT; y++) {
        gameMap[y] = [];
        for (let x = 0; x < GRID_WIDTH; x++) {
            gameMap[y][x] = TILE_TYPES.SOIL;
        }
    }

    // Exemplo: plantar algo no centro
    gameMap[Math.floor(GRID_HEIGHT / 2)][Math.floor(GRID_WIDTH / 2)] = TILE_TYPES.PLANT;
    gameMap[Math.floor(GRID_HEIGHT / 2) - 1][Math.floor(GRID_WIDTH / 2)] = TILE_TYPES.WATER;

    drawGame();
    setupEventListeners();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas

    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            const tileType = gameMap[y][x];
            ctx.fillStyle = TILE_COLORS[tileType];
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            // Opcional: desenhar bordas dos tiles
            ctx.strokeStyle = '#555';
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function setupEventListeners() {
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const gridX = Math.floor(mouseX / TILE_SIZE);
        const gridY = Math.floor(mouseY / TILE_SIZE);

        console.log(`Clicou em: [${gridX}, ${gridY}]`);

        // Exemplo de interação: alternar tipo de tile
        if (gameMap[gridY][gridX] === TILE_TYPES.SOIL) {
            gameMap[gridY][gridX] = TILE_TYPES.PLANT;
        } else if (gameMap[gridY][gridX] === TILE_TYPES.PLANT) {
            gameMap[gridY][gridX] = TILE_TYPES.WATER;
        } else {
            gameMap[gridY][gridX] = TILE_TYPES.SOIL;
        }
        drawGame(); // Redesenha o jogo após a mudança
    });
}

// Inicia o jogo quando a página carrega
initGame();