import Chart from 'chart.js/auto'

type TypeDataSets = {
    label: string, 
    data: number[], 
    fill: boolean, 
    borderColor: string, 
    tension: 0.1, 
}

type TypeChartData = {
        labels: string[], 
        datasets: TypeDataSets[],
}

export function createChart(
    elementHtml: HTMLElement, 
    chartData: TypeChartData
) {
  const ctx = elementHtml
  new Chart(ctx as HTMLCanvasElement, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}
