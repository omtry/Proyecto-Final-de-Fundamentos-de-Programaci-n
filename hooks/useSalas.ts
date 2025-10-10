import { useState, useEffect } from 'react';
import { salasService, checkServerHealth } from '@/config/api';

export interface Sala {
  id: number;
  nombre: string;
  tipo: string;
  descripcion: string;
  capacidad: number;
  imagen: string;
  disponible: boolean;
}

export interface Reserva {
  id: number;
  salaId: number;
  salaNombre: string;
  fecha: string;
  horario: string;
  duracion: number;
  proposito: string;
  participantes: number;
  estado: string;
}

export const useSalas = () => {
  const [salas, setSalas] = useState<Sala[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<boolean>(false);

  useEffect(() => {
    loadSalas();
    checkServer();
  }, []);

  const checkServer = async () => {
    try {
      const health = await checkServerHealth();
      setServerStatus(!!health);
    } catch (error) {
      setServerStatus(false);
    }
  };

  const loadSalas = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await salasService.getSalas();
      
      if (response.success) {
        setSalas(response.data);
      } else {
        setError('Error al cargar las salas');
      }
    } catch (error) {
      console.error('Error loading salas:', error);
      setError('No se pudo conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const crearReserva = async (reservaData: {
    salaId: number;
    fecha: string;
    horario: string;
    duracion: number;
    proposito: string;
    participantes: number;
    notas?: string;
  }) => {
    try {
      const response = await salasService.crearReserva(reservaData);
      return response;
    } catch (error) {
      console.error('Error creating reserva:', error);
      throw error;
    }
  };

  const getReservasUsuario = async (userId: string) => {
    try {
      const response = await salasService.getReservasUsuario(userId);
      return response;
    } catch (error) {
      console.error('Error loading reservas:', error);
      throw error;
    }
  };

  return {
    salas,
    loading,
    error,
    serverStatus,
    loadSalas,
    crearReserva,
    getReservasUsuario
  };
};
