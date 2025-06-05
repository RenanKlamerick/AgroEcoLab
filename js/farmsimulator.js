const farmSimulator = (function () {
  const gridSize = 10;
  const farmGrid = [];
  let mode = "plant";
  let selectedCrop = "milho";
  let money = 500;
  let soilHealth = 80;
  let waterLevel = 100;
  let podeColetarChuva = true;

  const grid = document.getElementById("farm-grid");
  const cropSelect = document.getElementById("crop-select");
  const soilSpan = document.getElementById("soil-health");
  const waterSpan = document.getElementById("water-level");
  const biodiversitySpan = document.getElementById("biodiversity");
  const moneySpan = document.getElementById("money");

  function createGrid() {
    grid.innerHTML = "";
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("farm-cell");
      cell.dataset.state = "empty";
      cell.dataset.growth = "0";
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
      cell.className = "farm-cell";
      cell.dataset.state = selectedCrop;
      cell.dataset.growth = "0";
      cell.classList.add(selectedCrop, "fase0", "planted");
      money -= 10;
      soilHealth -= 1;
      updateStatus();
      setTimeout(() => cell.classList.remove("planted"), 400);
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function water() {
    if (waterLevel > 0) {
      waterLevel -= 10;
      soilHealth += 2;
      farmGrid.forEach((cell) => {
        if (cell.dataset.state !== "empty") {
          let growth = parseInt(cell.dataset.growth || "0");
          if (growth < 3) {
            growth++;
            cell.dataset.growth = growth.toString();
            atualizarFaseVisual(cell);
          }
        }
      });
      updateStatus();
    } else {
      alert("Sem água!");
    }
  }

  function atualizarFaseVisual(cell) {
    const estado = cell.dataset.state;
    const fase = cell.dataset.growth;
    cell.className = "farm-cell";
    cell.classList.add(estado, `fase${fase}`);
    if (fase === "3") {
      cell.classList.add("ready");

    } else {
      cell.classList.remove("ready");
    }
  }

  function compost() {
    if (money >= 15) {
      soilHealth = Math.min(soilHealth + 10, 100);
      money -= 15;
      updateStatus();
      farmGrid.forEach((cell) => {
        if (cell.dataset.state !== "empty") {
          let growth = parseInt(cell.dataset.growth || "0");
          if (growth < 3) {
            growth++;
            cell.dataset.growth = growth.toString();
            atualizarFaseVisual(cell);
          }
        }
      });
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function harvest() {
    let harvested = 0;
    farmGrid.forEach((cell) => {
      if (cell.dataset.state !== "empty" && cell.dataset.growth === "3") {
        cell.className = "farm-cell";
        cell.dataset.state = "empty";
        cell.dataset.growth = "0";
        harvested += 5;
        soilHealth -= 2;
        cell.classList.add("harvested");
        setTimeout(() => cell.classList.remove("harvested"), 400);
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
    saveUserData({
      money,
      soilHealth,
      waterLevel,
      gridState: farmGrid.map((c) => c.dataset.state)
    });
  }

  function abrirLoja() {
    document.getElementById("store-modal").style.display = "flex";
  }

  function fecharLoja() {
    document.getElementById("store-modal").style.display = "none";
  }

  function comprarSemente() {
    if (money >= 10) {
      alert("Semente comprada com sucesso!");
      money -= 10;
      updateStatus(10);
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function comprarAgua() {
    if (waterLevel >= 100) {
      alert("Água já está no nível máximo.");
      return;
    }
    if (money >= 15) {
      // Aumenta o nível de água em 20% (máximo 100%)
      waterLevel = Math.min(waterLevel + 20, 100);
      money -= 15;
      document.getElementById("water-level").classList.remove("updated");
      document.getElementById("water-level").textContent = `${10}%`;
      document.getElementById("water-level").classList.add("updated");
      updateStatus(10);
      setTimeout(() => {
        document.getElementById("water-level").classList.remove("updated");
      }, 1000); // Remove a classe após 1 segundo
      // Salva o estado atualizado
      alert("Água comprada com sucesso!");
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function comprarComposto() {
    if (soilHealth >= 100) {
      alert("Saúde do solo já está no nível máximo.");
      return;
    }
    if (money >= 20) {
      soilHealth = Math.min(soilHealth + 15, 100);
      money -= 20;
      document.getElementById("soil-health").classList.remove("updated");
      document.getElementById("soil-health").textContent = `${soilHealth}%`;
      document.getElementById("soil-health").classList.add("updated");
      setTimeout(() => { 
        document.getElementById("soil-health").classList.remove("updated");
      }, 1000); // Remove a classe após 1 segundo
      alert("Composto comprado com sucesso!");
      updateStatus();
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function coletarAguaChuva() {
    if (!podeColetarChuva) {
      alert("A chuva já foi coletada hoje. Tente novamente mais tarde.");
      return;
    }
    waterLevel = Math.min(waterLevel + 50, 100);
    updateStatus();
    podeColetarChuva = false;
    alert("Você coletou 50% de água da chuva!");
    setTimeout(() => {
      podeColetarChuva = true;
    }, 60000); // 1 minuto para novo uso
  }

  function init(savedData = null) {
    createGrid();
    bindEvents();
    if (savedData) {
      money = savedData.money;
      soilHealth = savedData.soilHealth;
      waterLevel = savedData.waterLevel;
      savedData.gridState.forEach((state, i) => {
        const cell = farmGrid[i];
        cell.dataset.state = state;
        if (state !== "empty") {
          cell.classList.add(state);
        }
      });
    }
    updateStatus();
  }

  return {
    init,
    abrirLoja,
    fecharLoja,
    comprarSemente,
    comprarAgua,
    comprarComposto,
    coletarAguaChuva // <- ESSA LINHA É OBRIGATÓRIA
  };  
})();
