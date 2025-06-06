function handleRegister() {
  const user = document.getElementById("register-username").value.trim();
  const pass = document.getElementById("register-password").value.trim();

  if (!user || !pass) {
    alert("Preencha todos os campos.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (users[user]) {
    alert("Usuário já existe.");
    return;
  }

  users[user] = { password: pass };
  localStorage.setItem("users", JSON.stringify(users));

  alert("Cadastro realizado com sucesso!");
}

function handleLogin() {
  const user = document.getElementById("login-username").value.trim();
  const pass = document.getElementById("login-password").value.trim();

  if (!user || !pass) {
    alert("Digite o usuário e a senha.");
    return;
  }

  const users = JSON.parse(localStorage.getItem("users") || "{}");

  if (!users[user] || users[user].password !== pass) {
    alert("Usuário ou senha incorretos.");
    return;
  }

  localStorage.setItem("lastUser", user);
  window.location.href = "simulador.html";
}

// Sistema de salvamento
function loadUserData(username) {
  const data = localStorage.getItem(`farm_${username}`);
  return data ? JSON.parse(data) : null;
}

function saveUserData(data) {
  const username = localStorage.getItem("lastUser");
  if (!username) return;
  localStorage.setItem(`farm_${username}`, JSON.stringify(data));
}

// Sistema de missões
const quests = [
  {
    id: "beginner",
    title: "Primeiros Passos",
    objectives: [
      { description: "Plante 5 culturas", target: 5, current: 0, type: "plant" },
      { description: "Colha 3 culturas", target: 3, current: 0, type: "harvest" }
    ],
    reward: 50,
    completed: false
  },
  {
    id: "sustainable",
    title: "Fazenda Sustentável",
    objectives: [
      { description: "Alcance 80% de biodiversidade", target: 80, current: 0, type: "biodiversity" },
      { description: "Instale 2 painéis solares", target: 2, current: 0, type: "solar" }
    ],
    reward: 100,
    completed: false
  },
  {
    id: "animal-lover",
    title: "Amante dos Animais",
    objectives: [
      { description: "Tenha 3 animais", target: 3, current: 0, type: "animal" }
    ],
    reward: 75,
    completed: false
  }
];

function checkQuestProgress(type, amount = 1) {
  let updated = false;
  
  quests.forEach(quest => {
    if (quest.completed) return;
    
    quest.objectives.forEach(obj => {
      if (obj.type === type) {
        obj.current = Math.min(obj.current + amount, obj.target);
        updated = true;
      }
    });
    
    if (quest.objectives.every(obj => obj.current >= obj.target)) {
      completeQuest(quest);
    }
  });
  
  if (updated) {
    updateQuestDisplay();
  }
}

function completeQuest(quest) {
  quest.completed = true;
  const money = parseFloat(document.getElementById("money").textContent);
  document.getElementById("money").textContent = (money + quest.reward).toFixed(2);
  
  showNotification(`Missão "${quest.title}" completa! Recompensa: R$${quest.reward}`);
  updateQuestDisplay();
}

function updateQuestDisplay() {
  const questList = document.getElementById("quest-list");
  questList.innerHTML = '';
  
  quests.forEach(quest => {
    const questDiv = document.createElement("div");
    questDiv.className = `quest ${quest.completed ? 'completed' : ''}`;
    
    const title = document.createElement("h4");
    title.textContent = quest.title;
    questDiv.appendChild(title);
    
    quest.objectives.forEach(obj => {
      const objDiv = document.createElement("div");
      objDiv.textContent = `${obj.description}: ${obj.current}/${obj.target}`;
      questDiv.appendChild(objDiv);
      
      const progress = document.createElement("div");
      progress.className = "quest-progress";
      progress.style.width = `${(obj.current / obj.target) * 100}%`;
      questDiv.appendChild(progress);
    });
    
    if (quest.completed) {
      const reward = document.createElement("div");
      reward.textContent = `Recompensa: R$${quest.reward} (recebida)`;
      reward.style.fontWeight = "bold";
      questDiv.appendChild(reward);
    }
    
    questList.appendChild(questDiv);
  });
}

// Inicialização
if (document.getElementById("login-username")) {
  document.getElementById("login-button").addEventListener("click", handleLogin);
  document.getElementById("register-button").addEventListener("click", handleRegister);
}