// ===== SYSTÈME DE DESIGN MODERNE =====

// Palette de couleurs moderne
export const designSystem = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#f0fdf4',
      500: '#22c55e',
      600: '#16a34a'
    },
    accent: {
      500: '#2b0389ff',
      600: '#3b0a91ff'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgb(59 130 246 / 0.3)'
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem'
  }
};

// Ajouter les animations CSS globales
const addGlobalStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.05);
      }
      100% {
        transform: scale(1);
      }
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }

    .fade-in-up {
      animation: fadeInUp 0.6s ease-out;
    }

    .slide-in-right {
      animation: slideInRight 0.4s ease-out;
    }

    .pulse-on-hover:hover {
      animation: pulse 0.6s ease-in-out;
    }

    .shimmer-effect {
      background: linear-gradient(110deg, #e2e8f0 8%, #f1f5f9 18%, #e2e8f0 33%);
      background-size: 200px 100%;
      animation: shimmer 1.5s infinite;
    }

    /* Effets hover globaux */
    .hover-lift:hover {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }

    .hover-scale:hover {
      transform: scale(1.02);
      transition: transform 0.3s ease;
    }

    .hover-shadow:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transition: box-shadow 0.3s ease;
    }
  `;
  
  if (!document.getElementById('global-modern-styles')) {
    styleSheet.id = 'global-modern-styles';
    document.head.appendChild(styleSheet);
  }
};

// Initialiser les styles globaux
if (typeof document !== 'undefined') {
  addGlobalStyles();
}
