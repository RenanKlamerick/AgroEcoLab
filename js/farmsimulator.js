const farmSimulator = (function () {
    const gridSize = 10;
    const farmGrid = [];
    let mode = "plant";
    let selectedCrop = "milho";
    let money = 100;
    let soilHealth = 80;
    let waterLevel = 100;
  
    const grid = document.getElementById("farm-grid");
    const cropSelect = document.getElementById("crop-select");
    const soilSpan = document.getElementById("soil-health");
    const waterSpan = document.getElementById("water-level");
    const biodiversitySpan = document.getElementById("biodiversity");
    const moneySpan = document.getElementById("money");
  
    function init() {
      createGrid();
      bindEvents();
      updateStatus();
    }
  
    function createGrid() {
      grid.innerHTML = "";
      for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("farm-cell");
        cell.dataset.state = "empty";
        grid.appendChild(cell);
        farmGrid.push(cell);
      }
    }
  
    function bindEvents() {
      grid.addEventListener("click", (e) => {
        if (e.target.classList.contains("farm-cell")) {
          plantCrop(e.target);
        }
      });
  
      document.getElementById("plant-button").addEventListener("click", () => {
        mode = "plant";
      });
  
      document.getElementById("water-button").addEventListener("click", water);
      document.getElementById("harvest-button").addEventListener("click", harvest);
      document.getElementById("compost-button").addEventListener("click", compost);
  
      cropSelect.addEventListener("change", () => {
        selectedCrop = cropSelect.value;
      });
    }
  
    function plantCrop(cell) {
      if (cell.dataset.state !== "empty") return;
  
      if (money >= 10) {
        cell.classList.add(selectedCrop);
        cell.dataset.state = selectedCrop;
        money -= 10;
        soilHealth -= 1;
        updateStatus();
      } else {
        alert("Dinheiro insuficiente.");
      }
    }
  
    function water() {
      if (waterLevel > 0) {
        waterLevel -= 10;
        soilHealth += 2;
        updateStatus();
      } else {
        alert("Sem água!");
      }
    }
  
    function compost() {
      if (money >= 15) {
        soilHealth = Math.min(soilHealth + 10, 100);
        money -= 15;
        updateStatus();
      } else {
        alert("Dinheiro insuficiente.");
      }
    }
  
    function harvest() {
      let harvested = 0;
      farmGrid.forEach((cell) => {
        if (cell.dataset.state !== "empty") {
          cell.className = "farm-cell";
          cell.dataset.state = "empty";
          harvested += 1;
        }
      });
  
      money += harvested * 5;
      updateStatus();
    }
  
    function updateStatus() {
      soilSpan.textContent = `${soilHealth}%`;
      waterSpan.textContent = `${waterLevel}%`;
      biodiversitySpan.textContent = `${Math.min(100, soilHealth / 2)}%`;
      moneySpan.textContent = money.toFixed(2);
    }
  
    return {
      init,
    };
  })();
  