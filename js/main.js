document.addEventListener('DOMContentLoaded', () => {
  console.log('AgroEcoLab carregado!');

  // Exemplo de atualização de status
  updateStatus({
      soilHealth: 'Bom',
      waterLevel: 'Alto',
      biodiversityScore: 75,
      money: 1000
  });

  // Inicializa o simulador de fazenda
  farmSimulator.init();
});

function updateStatus(status) {
  document.getElementById('soil-health').textContent = status.soilHealth;
  document.getElementById('water-level').textContent = status.waterLevel;
  document.getElementById('biodiversity-score').textContent = status.biodiversityScore;
  document.getElementById('money').textContent = `R$ ${status.money.toFixed(2)}`;
}