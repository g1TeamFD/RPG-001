// ============================================
// UI & CHART VISUALIZATION
// ============================================

const MAX_MINDSET_SCORE = 30;

function initChart() {
  const ctx = document.getElementById('mindset-chart');
  if (!ctx) return;

  mindsetChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [
        'Resource Craftsman',
        'Systems Thinker',
        'Experimenter',
        'Calm Strategist',
        'Value Hunter'
      ],
      datasets: [
        {
          label: 'Score',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            '#E85D4D', // Resource Craftsman
            '#2C3E3C', // Systems Thinker
            '#6B9DB5', // Experimenter
            '#8BA89C', // Calm Strategist
            '#4DD8C6'  // Value Hunter
          ],
          borderRadius: 6,
          barThickness: 14,
          categoryPercentage: 0.9,
          barPercentage: 1.0,
          stack: 'total'
        },
        {
          label: 'Remaining',
          data: [MAX_MINDSET_SCORE, MAX_MINDSET_SCORE, MAX_MINDSET_SCORE, MAX_MINDSET_SCORE, MAX_MINDSET_SCORE],
          backgroundColor: 'rgba(0,0,0,0.08)',
          borderRadius: 6,
          barThickness: 14,
          categoryPercentage: 0.9,
          barPercentage: 1.0,
          stack: 'total'
        }
      ]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      },
      scales: {
        x: {
          stacked: true,
          min: 0,
          max: MAX_MINDSET_SCORE,
          display: false
        },
        y: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: '#2C3E3C',
            font: { size: 12, weight: '600' }
          }
        }
      }
    }
  });
}



function updateChart() {
  if (!mindsetChart) return;

  const values = [
    mindsetScores.resourceCraftsman,
    mindsetScores.systemsThinker,
    mindsetScores.experimenter,
    mindsetScores.calmStrategist,
    mindsetScores.valueHunter
  ];

  mindsetChart.data.datasets[0].data = values;
  mindsetChart.data.datasets[1].data = values.map(v =>
    Math.max(MAX_MINDSET_SCORE - v, 0)
  );

  mindsetChart.update();
}


