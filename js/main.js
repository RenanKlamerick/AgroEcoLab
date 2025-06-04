document.addEventListener("DOMContentLoaded", () => {
  console.log("AgroEcoLab carregado!");
  farmSimulator.init();
});
let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", handleLogin);

  if (localStorage.getItem("lastUser")) {
    document.getElementById("username").value = localStorage.getItem("lastUser");
  }
});

function handleLogin() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Digite um nome!");

  currentUser = username;
  localStorage.setItem("lastUser", username);
  document.getElementById("login-screen").style.display = "none";
  document.querySelector("main").style.display = "block";

  farmSimulator.init(loadUserData(username));
}

function loadUserData(username) {
  const data = localStorage.getItem(`farm_${username}`);
  return data ? JSON.parse(data) : null;
}

function saveUserData(data) {
  if (!currentUser) return;
  localStorage.setItem(`farm_${currentUser}`, JSON.stringify(data));
}
