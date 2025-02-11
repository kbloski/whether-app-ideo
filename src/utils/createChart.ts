import Chart from 'chart.js/auto'

type TypeDataSets = {
  label: string
  data: number[]
  fill: boolean
  borderColor: string
  tension: number
}

type TypeChartData = {
  labels: string[]
  datasets: TypeDataSets[]
}

export function createChart(elementHtml: HTMLCanvasElement, chartData: TypeChartData): Chart {

  return new Chart(elementHtml, {
    type: 'line',
    data: chartData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  })
}

export function destroyChart(chartInstance: Chart) {
  chartInstance.destroy()
}
