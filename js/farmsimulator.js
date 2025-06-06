const farmSimulator = (function () {
  // Configurações básicas
  const gridSize = 10;
  const farmGrid = [];
  let mode = "plant";
  let selectedCrop = "milho";
  let money = 50.00;
  let biodiversity = 100;
  let soilHealth = 80.0;
  let waterLevel = 100.0;
  let podeColetarChuva = true;
  let solarPanels = 0;
  let currentDay = 0;

  // Elementos do DOM
  const grid = document.getElementById("farm-grid");
  const cropSelect = document.getElementById("crop-select");
  const soilSpan = document.getElementById("soil-health");
  const waterSpan = document.getElementById("water-level");
  const biodiversitySpan = document.getElementById("biodiversity");
  const moneySpan = document.getElementById("money");
  const seasonSpan = document.getElementById("current-season");
  const daySpan = document.getElementById("current-day");
  const solarSpan = document.getElementById("solar-panels");

  // Sistema de estações
  const seasons = {
    spring: { 
      name: "Primavera",
      duration: 30, 
      growthModifier: 1.2, 
      color: '#a8e6cf',
      suitableCrops: ['alface', 'feijao']
    },
    summer: { 
      name: "Verão",
      duration: 30, 
      growthModifier: 1.5, 
      color: '#f7d486',
      suitableCrops: ['milho', 'tomate']
    },
    autumn: { 
      name: "Outono",
      duration: 30, 
      growthModifier: 0.8, 
      color: '#e8a87c',
      suitableCrops: ['abobora', 'cenoura']
    },
    winter: { 
      name: "Inverno",
      duration: 30, 
      growthModifier: 0.5, 
      color: '#d4f1f9',
      suitableCrops: ['alface', 'espinafre']
    }
  };

  let currentSeason = 'spring';

  // Culturas e preços
  const cropPrices = {
    milho: 10,
    feijao: 8,
    alface: 6,
    tomate: 12,
    abobora: 15,
    cenoura: 7,
    espinafre: 9
  };

  // Sistema de animais
  const animals = {
    chicken: {
      cost: 30,
      produce: 'eggs',
      productionTime: 3,
      happiness: 100,
      profit: 5
    },
    cow: {
      cost: 100,
      produce: 'milk',
      productionTime: 5,
      happiness: 100,
      profit: 15
    }
  };

  let ownedAnimals = [];

  // Eventos climáticos
  const weatherEvents = [
    {
      name: "Seca",
      probability: 0.1,
      effect: () => {
        waterLevel -= 30;
        showNotification("Seca intensa! Níveis de água diminuídos.");
      }
    },
    {
      name: "Chuva Forte",
      probability: 0.15,
      effect: () => {
        waterLevel = Math.min(waterLevel + 40, 100);
        showNotification("Chuva forte! Tanques de água recarregados.");
      }
    },
    {
      name: "Praga",
      probability: 0.1,
      effect: () => {
        // Remove algumas plantas aleatoriamente
        const affectedPlants = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < affectedPlants; i++) {
          const randomIndex = Math.floor(Math.random() * farmGrid.length);
          if (farmGrid[randomIndex].dataset.state !== "empty") {
            farmGrid[randomIndex].dataset.state = "empty";
            farmGrid[randomIndex].className = "farm-cell";
          }
        }
        showNotification("Praga atacou sua plantação!");
      }
    }
  ];

  // Funções principais
  function createGrid() {
    farmGrid.length = 0;
    grid.innerHTML = "";
    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement("div");
      cell.classList.add("farm-cell");
      cell.dataset.state = "empty";
      cell.dataset.growth = "0";
      grid.appendChild(cell);
      farmGrid.push(cell);
      cell.dataset.index = i;
      cell.title = `Célula ${i + 1}`;
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
    
    // Novo: Botão para avançar o dia
    document.getElementById("next-day-button").addEventListener("click", nextDay);
  }

  function plantCrop(cell) {
    if (cell.dataset.state !== "empty") return;
    
    const season = seasons[currentSeason];
    if (!season.suitableCrops.includes(selectedCrop)) {
      showNotification(`Esta cultura não cresce bem na ${season.name.toLowerCase()}!`);
      return;
    }

    const price = cropPrices[selectedCrop];
    if (money >= price) {
      cell.className = "farm-cell";
      cell.dataset.state = selectedCrop;
      cell.dataset.growth = "0";
      cell.classList.add(selectedCrop, "fase0", "planted");
      money -= price;
      soilHealth -= 1;
      updateStatus();
      setTimeout(() => cell.classList.remove("planted"), 400);
      
      // Atualiza missões
      checkQuestProgress('plant');
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
            // Aplica modificador sazonal
            const growthAmount = seasons[currentSeason].growthModifier > 1 ? 1.5 : 1;
            growth += growthAmount;
            cell.dataset.growth = Math.min(growth, 3).toString();
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
    cell.classList.add(estado, `fase${Math.floor(fase)}`);
    if (fase >= 3) {
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
      if (cell.dataset.state !== "empty" && cell.dataset.growth >= 3) {
        const crop = cell.dataset.state;
        cell.className = "farm-cell";
        cell.dataset.state = "empty";
        cell.dataset.growth = "0";
        harvested += cropPrices[crop] || 5;
        soilHealth -= 2;
        cell.classList.add("harvested");
        setTimeout(() => cell.classList.remove("harvested"), 400);
      }
    });
    
    if (harvested > 0) {
      money += harvested;
      checkQuestProgress('harvest');
      updateStatus();
    }
  }

  function updateSeason() {
    currentDay++;
    daySpan.textContent = currentDay;
    
    const totalDays = Object.values(seasons).reduce((sum, s) => sum + s.duration, 0);
    const dayInCycle = currentDay % totalDays;
    
    let daysPassed = 0;
    for (const [season, data] of Object.entries(seasons)) {
      if (dayInCycle < daysPassed + data.duration) {
        if (currentSeason !== season) {
          currentSeason = season;
          seasonSpan.textContent = data.name;
          document.body.style.backgroundColor = data.color;
          showNotification(`Estação mudou para ${data.name}!`);
        }
        return;
      }
      daysPassed += data.duration;
    }
  }

  function checkWeather() {
    for (const event of weatherEvents) {
      if (Math.random() < event.probability) {
        event.effect();
        updateStatus();
        break;
      }
    }
  }

  function updateAnimalProduction() {
    ownedAnimals.forEach(animal => {
      animal.daysSinceLastProduction++;
      if (animal.daysSinceLastProduction >= animal.productionTime) {
        money += animal.profit;
        animal.daysSinceLastProduction = 0;
        showNotification(`Seu ${animal.type} produziu ${animal.produce}!`);
      }
    });
  }

  function buyAnimal(type) {
    if (money >= animals[type].cost) {
      money -= animals[type].cost;
      ownedAnimals.push({
        type: type,
        daysSinceLastProduction: 0,
        ...animals[type]
      });
      updateStatus();
      updateAnimalDisplay();
      showNotification(`Você comprou um(a) ${type}!`);
      
      // Atualiza missões
      checkQuestProgress('animal');
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function updateAnimalDisplay() {
    const animalPen = document.getElementById("animal-pen");
    animalPen.innerHTML = '';
    ownedAnimals.forEach(animal => {
      const animalDiv = document.createElement("div");
      animalDiv.className = `animal ${animal.type}`;
      animalDiv.title = `${animal.type} (Produz ${animal.produce} a cada ${animal.productionTime} dias)`;
      animalPen.appendChild(animalDiv);
    });
  }

  function buySolarPanel() {
    const cost = 200 + (solarPanels * 50); // Fica mais caro a cada compra
    if (money >= cost) {
      money -= cost;
      solarPanels++;
      solarSpan.textContent = solarPanels;
      
      // Reduz custos de água em 5% por painel (máx 50%)
      updateStatus();
      showNotification(`Painel solar instalado! (Total: ${solarPanels})`);
      
      // Atualiza missões
      checkQuestProgress('solar');
    } else {
      alert("Dinheiro insuficiente.");
    }
  }

  function nextDay() {
    updateSeason();
    checkWeather();
    updateAnimalProduction();
    updateStatus();
    
    // Restaura a coleta de chuva diariamente
    podeColetarChuva = true;
  }

  function updateStatus() {
    // Atualiza biodiversidade baseada na saúde do solo
    biodiversity = Math.min(100, soilHealth / 2 + (ownedAnimals.length * 5));
    
    soilSpan.textContent = `${soilHealth.toFixed(1)}%`;
    waterSpan.textContent = `${waterLevel.toFixed(1)}%`;
    biodiversitySpan.textContent = `${biodiversity.toFixed(1)}%`;
    moneySpan.textContent = money.toFixed(2);
    
    // Efeitos visuais de atualização
    document.getElementById("biodiversity").classList.remove("updated");
    document.getElementById("biodiversity").classList.add("updated");
    setTimeout(() => {
      document.getElementById("biodiversity").classList.remove("updated");
    }, 1000);
    
    saveUserData(getSaveData());
  }

  function getSaveData() {
    return {
      money,
      soilHealth,
      waterLevel,
      solarPanels,
      currentDay,
      ownedAnimals,
      gridState: farmGrid.map((c) => c.dataset.state),
      gridGrowth: farmGrid.map((c) => c.dataset.growth)
    };
  }

  function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add("fade-out");
      setTimeout(() => notification.remove(), 1000);
    }, 3000);
  }

  function init(savedData = null) {
    createGrid();
    bindEvents();
    
    if (savedData) {
      money = savedData.money || money;
      soilHealth = savedData.soilHealth || soilHealth;
      waterLevel = savedData.waterLevel || waterLevel;
      solarPanels = savedData.solarPanels || solarPanels;
      currentDay = savedData.currentDay || currentDay;
      ownedAnimals = savedData.ownedAnimals || [];
      
      if (savedData.gridState) {
        savedData.gridState.forEach((state, i) => {
          const cell = farmGrid[i];
          cell.dataset.state = state;
          cell.dataset.growth = savedData.gridGrowth[i] || "0";
          if (state !== "empty") {
            cell.classList.add(state);
            atualizarFaseVisual(cell);
          }
        });
      }
      
      updateSeason(); // Atualiza a estação visual
      updateAnimalDisplay();
    }
    
    updateStatus();
    
    // Inicia o loop do jogo
    setInterval(() => {
      // Diminui a água gradualmente
      if (waterLevel > 0) waterLevel -= 0.5;
      updateStatus();
    }, 60000); // Atualiza a cada minuto
  }

  return {
    init,
    buyAnimal,
    buySolarPanel,
    coletarAguaChuva: function() {
      if (!podeColetarChuva) {
        alert("A chuva já foi coletada hoje. Tente novamente amanhã.");
        return;
      }
      waterLevel = Math.min(waterLevel + 50, 100);
      updateStatus();
      podeColetarChuva = false;
      showNotification("Você coletou 50% de água da chuva!");
    },
    nextDay
  };
})();