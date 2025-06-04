const farmSimulator = (function() {
  let farmGrid = [];
  const gridSize = 10; // 10x10 cells
  let currentMoney = 500;
  let soilHealth = 80; // 0-100
  let waterLevel = 100; // 0-100

  const farmGridElement = document.getElementById('farm-grid');
  const plantButton = document.getElementById('plant-button');
  const waterButton = document.getElementById('water-button');
  const harvestButton = document.getElementById('harvest-button');
  const compostButton = document.getElementById('compost-button');

  function init() {
      generateFarmGrid();
      setupEventListeners();
      updateFarmStatusDisplay();
      console.log('Simulador de fazenda inicializado.');
  }

  function generateFarmGrid() {
      farmGridElement.innerHTML = ''; // Limpa o grid existente
      farmGrid = [];
      for (let i = 0; i < gridSize; i++) {
          farmGrid[i] = [];
          for (let j = 0; j < gridSize; j++) {
              const cell = document.createElement('div');
              cell.classList.add('farm-cell');
              cell.dataset.row = i;
              cell.dataset.col = j;
              cell.dataset.content = 'empty'; // Pode ser 'empty', 'corn', 'bean', etc.
              farmGridElement.appendChild(cell);
              farmGrid[i][j] = { element: cell, content: 'empty' };
          }
      }
  }

  function setupEventListeners() {
      farmGridElement.addEventListener('click', handleCellClick);
      plantButton.addEventListener('click', () => {
          // Lógica para selecionar o que plantar e ativar o modo de plantio
          console.log('Modo Plantar ativado.');
          // Implementar lógica para permitir o clique em células para plantar
      });
      waterButton.addEventListener('click', () => {
          console.log('Regando a fazenda.');
          waterFarm();
      });
      harvestButton.addEventListener('click', () => {
          console.log('Colhendo produtos.');
          // Implementar lógica de colheita
      });
      compostButton.addEventListener('click', () => {
          console.log('Adicionando compostagem.');
          addCompost();
      });
  }

  function handleCellClick(event) {
      const cell = event.target;
      if (cell.classList.contains('farm-cell')) {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          console.log(`Célula clicada: [${row}, ${col}]`);

          // Exemplo: se o modo de plantio estiver ativo
          // if (currentMode === 'plant' && farmGrid[row][col].content === 'empty') {
          //     plantCrop(row, col, 'corn'); // Exemplo: plantar milho
          // }
      }
  }

  function plantCrop(row, col, cropType) {
      if (currentMoney >= 10) { // Custo hipotético
          farmGrid[row][col].content = cropType;
          farmGrid[row][col].element.classList.add(`planted-${cropType}`);
          currentMoney -= 10;
          updateFarmStatusDisplay();
          console.log(`Plantou ${cropType} em [${row}, ${col}]`);
      } else {
          alert('Dinheiro insuficiente para plantar!');
      }
  }

  function waterFarm() {
      if (waterLevel > 0) {
          waterLevel = Math.max(0, waterLevel - 10); // Gasta água
          soilHealth = Math.min(100, soilHealth + 5); // Melhora um pouco a saúde do solo
          updateFarmStatusDisplay();
          console.log('Fazenda regada.');
      } else {
          alert('Sem água suficiente para regar!');
      }
  }

  function addCompost() {
      if (currentMoney >= 20) { // Custo hipotético
          soilHealth = Math.min(100, soilHealth + 15); // Melhora significativamente a saúde do solo
          currentMoney -= 20;
          updateFarmStatusDisplay();
          console.log('Compostagem adicionada.');
      } else {
          alert('Dinheiro insuficiente para compostagem!');
      }
  }

  function updateFarmStatusDisplay() {
      document.getElementById('soil-health').textContent = soilHealth + '%';
      document.getElementById('water-level').textContent = waterLevel + '%';
      document.getElementById('biodiversity-score').textContent = 'N/A'; // Lógica mais complexa para biodiversidade
      document.getElementById('money').textContent = `R$ ${currentMoney.toFixed(2)}`;
  }

  return {
      init: init,
      plantCrop: plantCrop, // Pode ser acessado de fora para fins de debug ou UI
      waterFarm: waterFarm
  };
})();