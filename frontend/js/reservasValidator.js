/**
 * Validador de reservas en el frontend
 * Valida datos antes de enviarlos al backend
 */

class ReservasValidator {
  constructor() {
    this.errors = [];
  }

  /**
   * Limpiar errores previos
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Validar una reserva completa
   */
  validateReserva(reservaData) {
    this.clearErrors();

    // Validar salaId
    if (!reservaData.salaId || reservaData.salaId.trim() === '') {
      this.errors.push({ field: 'salaId', message: 'Debes seleccionar una sala' });
    }

    // Validar fecha
    if (!reservaData.fecha) {
      this.errors.push({ field: 'fecha', message: 'Debes seleccionar una fecha' });
    } else {
      // Parsear fecha manualmente para evitar problemas de zona horaria
      const [year, month, day] = reservaData.fecha.split('-').map(Number);
      const fecha = new Date(year, month - 1, day); // month es 0-indexed
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha < hoy) {
        this.errors.push({ field: 'fecha', message: 'No puedes reservar fechas pasadas' });
      }
    }

    // Validar horario
    if (!reservaData.horario || reservaData.horario.trim() === '') {
      this.errors.push({ field: 'horario', message: 'Debes seleccionar un horario' });
    } else {
      const horaPattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!horaPattern.test(reservaData.horario)) {
        this.errors.push({ field: 'horario', message: 'Formato de horario inválido (debe ser HH:MM)' });
      }

      // Validar que el horario esté en el rango permitido (7:00 - 17:00)
      const [hora] = reservaData.horario.split(':').map(Number);
      if (hora < 7 || hora > 17) {
        this.errors.push({ field: 'horario', message: 'El horario debe estar entre las 7:00 y 17:00 (5:00 PM)' });
      }
    }

    // Validar duración
    if (!reservaData.duracion) {
      this.errors.push({ field: 'duracion', message: 'Debes seleccionar una duración' });
    } else {
      const duracion = parseFloat(reservaData.duracion);
      if (isNaN(duracion) || duracion <= 0) {
        this.errors.push({ field: 'duracion', message: 'La duración debe ser mayor que 0' });
      }
      if (duracion > 8) {
        this.errors.push({ field: 'duracion', message: 'La duración máxima es de 8 horas' });
      }

      // Validar que no exceda las 6:00 PM (18:00) - las salas cierran a las 6 PM
      if (reservaData.horario) {
        const [hora] = reservaData.horario.split(':').map(Number);
        const horaFin = hora + duracion;
        if (horaFin > 18) {
          this.errors.push({ 
            field: 'duracion', 
            message: `La reserva excede el horario permitido. Las salas cierran a las 6:00 PM. Con inicio a las ${reservaData.horario}, la duración máxima es ${18 - hora} horas` 
          });
        }
      }
    }

    // Validar propósito
    if (!reservaData.proposito || reservaData.proposito.trim() === '') {
      this.errors.push({ field: 'proposito', message: 'Debes especificar el propósito de la reserva' });
    } else if (reservaData.proposito.length < 3) {
      this.errors.push({ field: 'proposito', message: 'El propósito debe tener al menos 3 caracteres' });
    } else if (reservaData.proposito.length > 200) {
      this.errors.push({ field: 'proposito', message: 'El propósito no puede exceder 200 caracteres' });
    }

    // Validar participantes
    if (reservaData.participantes !== undefined && reservaData.participantes !== null) {
      const participantes = parseInt(reservaData.participantes);
      if (isNaN(participantes) || participantes < 1) {
        this.errors.push({ field: 'participantes', message: 'Debe haber al menos 1 participante' });
      }
      if (participantes > 20) {
        this.errors.push({ field: 'participantes', message: 'El máximo de participantes es 20' });
      }
    }

    // Validar notas (opcional pero con límite)
    if (reservaData.notas && reservaData.notas.length > 500) {
      this.errors.push({ field: 'notas', message: 'Las notas no pueden exceder 500 caracteres' });
    }

    return this.errors.length === 0;
  }

  /**
   * Obtener todos los errores
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Obtener el primer error
   */
  getFirstError() {
    return this.errors.length > 0 ? this.errors[0].message : null;
  }

  /**
   * Obtener error por campo
   */
  getErrorByField(fieldName) {
    const error = this.errors.find(e => e.field === fieldName);
    return error ? error.message : null;
  }

  /**
   * Validar formato de fecha
   */
  validateDateFormat(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
}

// Exportar como singleton global
window.reservasValidator = new ReservasValidator();

