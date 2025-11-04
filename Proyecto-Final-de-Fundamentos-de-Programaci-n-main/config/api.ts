// Configuración de la API para el frontend móvil
export const API_CONFIG = {
  BASE_URL: __DEV__ ? 'http://localhost:3000' : 'https://your-production-url.com',
  ENDPOINTS: {
    HEALTH: '/api/health',
    SALAS: '/api/salas',
    HORARIOS: '/api/horarios',
    RESERVAS: '/api/reservas',
    AUTH: {
      LOGIN: '/api/auth/login'
    }
  }
};

// Función para hacer peticiones HTTP
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Servicios específicos para las salas
export const salasService = {
  // Obtener todas las salas
  getSalas: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.SALAS);
  },

  // Obtener horarios disponibles
  getHorarios: async () => {
    return apiRequest(API_CONFIG.ENDPOINTS.HORARIOS);
  },

  // Crear una reserva
  crearReserva: async (reservaData: {
    salaId: number;
    fecha: string;
    horario: string;
    duracion: number;
    proposito: string;
    participantes: number;
    notas?: string;
  }) => {
    return apiRequest(API_CONFIG.ENDPOINTS.RESERVAS, {
      method: 'POST',
      body: JSON.stringify(reservaData),
    });
  },

  // Obtener reservas del usuario
  getReservasUsuario: async (userId: string) => {
    return apiRequest(`${API_CONFIG.ENDPOINTS.RESERVAS}/${userId}`);
  }
};

// Servicios de autenticación
export const authService = {
  // Login con email y contraseña
  login: async (email: string, password: string) => {
    return apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
};

// Verificar si el servidor está disponible
export const checkServerHealth = async () => {
  try {
    const response = await apiRequest(API_CONFIG.ENDPOINTS.HEALTH);
    return response;
  } catch (error) {
    console.error('Server health check failed:', error);
    return null;
  }
};
