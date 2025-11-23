/**
 * Sistema de polling para actualizar reservas sin recargar la página
 * Verifica cambios en las reservas del usuario cada cierto tiempo
 */

class ReservasPolling {
  constructor(options = {}) {
    this.interval = options.interval || 30000; // 30 segundos por defecto
    this.onUpdate = options.onUpdate || null;
    this.enabled = false;
    this.timeoutId = null;
    this.lastReservasHash = null;
    this.isPolling = false;
  }

  /**
   * Iniciar polling
   */
  start() {
    if (this.enabled) {
      return; // Ya está corriendo
    }

    // Verificar que el usuario esté autenticado
    if (!window.auth || !window.auth.isAuthenticated()) {
      console.warn('[ReservasPolling] Usuario no autenticado, polling no iniciado');
      return;
    }

    this.enabled = true;
    console.log('[ReservasPolling] Polling iniciado');
    this.poll();
  }

  /**
   * Detener polling
   */
  stop() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.enabled = false;
    this.isPolling = false;
    console.log('[ReservasPolling] Polling detenido');
  }

  /**
   * Realizar polling
   */
  async poll() {
    if (!this.enabled || this.isPolling) {
      return;
    }

    this.isPolling = true;

    try {
      // Obtener reservas del usuario
      const response = await window.api.getReservasUsuario();
      
      if (response && response.success) {
        const reservas = response.data || [];
        const currentHash = this.hashReservas(reservas);

        // Verificar si hay cambios
        if (currentHash !== this.lastReservasHash) {
          console.log('[ReservasPolling] Cambios detectados en reservas');
          this.lastReservasHash = currentHash;

          // Notificar cambios
          if (this.onUpdate && typeof this.onUpdate === 'function') {
            this.onUpdate(reservas);
          }

          // Disparar evento personalizado
          window.dispatchEvent(new CustomEvent('reservasUpdated', {
            detail: { reservas }
          }));
        }
      }
    } catch (error) {
      console.error('[ReservasPolling] Error al obtener reservas:', error);
      
      // Si hay error de autenticación, detener polling
      if (error.message.includes('401') || error.message.includes('Token')) {
        console.warn('[ReservasPolling] Error de autenticación, deteniendo polling');
        this.stop();
      }
    } finally {
      this.isPolling = false;

      // Programar siguiente polling si está habilitado
      if (this.enabled) {
        this.timeoutId = setTimeout(() => this.poll(), this.interval);
      }
    }
  }

  /**
   * Crear hash de las reservas para detectar cambios
   */
  hashReservas(reservas) {
    if (!reservas || reservas.length === 0) {
      return 'empty';
    }

    // Crear un hash simple basado en IDs, estados y timestamps
    const hashData = reservas.map(r => ({
      id: r.id,
      estado: r.estado,
      timestamp: r.timestamp || r.fechaCreacion
    })).sort((a, b) => a.id.localeCompare(b.id));

    return JSON.stringify(hashData);
  }

  /**
   * Forzar una actualización inmediata
   */
  async refresh() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    await this.poll();
  }

  /**
   * Actualizar intervalo de polling
   */
  setInterval(interval) {
    this.interval = interval;
    
    // Si está corriendo, reiniciar con el nuevo intervalo
    if (this.enabled) {
      this.stop();
      this.start();
    }
  }
}

// Crear instancia global
window.reservasPolling = new ReservasPolling({
  interval: 30000, // 30 segundos
  onUpdate: (reservas) => {
    // Callback por defecto: actualizar UI si existe la función
    if (typeof updateReservasList === 'function') {
      updateReservasList(reservas);
    }
  }
});

// Iniciar polling cuando el usuario esté autenticado
document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que Firebase se inicialice
  setTimeout(() => {
    if (window.auth && window.auth.isAuthenticated()) {
      window.reservasPolling.start();
    }

    // Escuchar cambios en el estado de autenticación
    window.addEventListener('authStateChanged', (event) => {
      const { isAuthenticated } = event.detail;
      
      if (isAuthenticated) {
        window.reservasPolling.start();
      } else {
        window.reservasPolling.stop();
      }
    });
  }, 2000);
});

