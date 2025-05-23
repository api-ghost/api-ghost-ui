export const COLORS = {
  GREEN: '#4CAF50',
  GREEN_HOVER: '#45a049',
  RED: '#F44336',
  RED_HOVER: '#e53935',

  TEAL_LIGHT: 'rgba(75, 192, 192, 0.6)',
  BLUE_LIGHT: 'rgba(54, 162, 235, 0.6)',
  YELLOW_LIGHT: 'rgba(255, 206, 86, 0.6)',
  ORANGE_LIGHT: 'rgba(255, 159, 64, 0.6)',
  PINK_LIGHT: 'rgba(255, 99, 132, 0.6)',

  TEAL: 'rgba(75, 192, 192, 1)',
  BLUE: 'rgba(54, 162, 235, 1)',
  YELLOW: 'rgba(255, 206, 86, 1)',
  ORANGE: 'rgba(255, 159, 64, 1)',
  PINK: 'rgba(255, 99, 132, 1)',

  TEAL_BG: 'rgba(75, 192, 192, 0.2)',
  BLUE_BG: 'rgba(54, 162, 235, 0.2)',
  PINK_BG: 'rgba(255, 99, 132, 0.2)',
};

export const CHART_OPTIONS = {
  doughnut: {
    label: ['Success', 'Failure'],
    color: {
      backgroundColor: [COLORS.GREEN, COLORS.RED],
      hoverBackgroundColor: [COLORS.GREEN_HOVER, COLORS.RED_HOVER],
    },
  },
  bar: {
    label: ['Min', 'Median', 'P90', 'P95', 'Max'],
    color: {
      backgroundColor: [
        COLORS.TEAL_LIGHT,
        COLORS.BLUE_LIGHT,
        COLORS.YELLOW_LIGHT,
        COLORS.ORANGE_LIGHT,
        COLORS.PINK_LIGHT,
      ],
      borderColor: [COLORS.TEAL, COLORS.BLUE, COLORS.YELLOW, COLORS.ORANGE, COLORS.PINK],
    },
  },
  line: {
    color: {
      vus: {
        color: COLORS.TEAL,
        bg: COLORS.TEAL_BG,
      },
      rps: {
        color: COLORS.BLUE,
        bg: COLORS.BLUE_BG,
      },
      errorRate: {
        color: COLORS.PINK,
        bg: COLORS.PINK_BG,
      },
      checksRate: {
        color: COLORS.TEAL,
        bg: COLORS.TEAL_BG,
      },
      durations: {
        avg: COLORS.BLUE,
        med: COLORS.TEAL,
        p90: COLORS.YELLOW,
        p95: COLORS.PINK,
      },
    },
  },
};
