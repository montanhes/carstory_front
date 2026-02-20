import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Configurações globais tema abyss
ChartJS.defaults.font.family = 'ui-sans-serif, system-ui, sans-serif';
ChartJS.defaults.color = '#a6adba'; // text-base-content do abyss

export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#a6adba',
        padding: 15,
        font: { size: 12 }
      }
    },
    tooltip: {
      backgroundColor: '#1c2635',
      borderColor: '#384152',
      borderWidth: 1,
      titleColor: '#fff',
      bodyColor: '#a6adba',
      padding: 12,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          label += 'R$ ' + context.parsed.y.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          });
          return label;
        }
      }
    }
  },
  scales: {
    x: {
      grid: { color: '#384152', drawBorder: false },
      ticks: { color: '#a6adba' }
    },
    y: {
      grid: { color: '#384152', drawBorder: false },
      ticks: {
        color: '#a6adba',
        callback: function(value: any) {
          return 'R$ ' + value.toLocaleString('pt-BR');
        }
      }
    }
  }
};
