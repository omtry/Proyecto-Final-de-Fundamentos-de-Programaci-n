// API Client para conectar con el backend
// Configuración de la API
const API_BASE_URL = window.location.origin + '/api';

// Clase para manejar las llamadas a la API
class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Método genérico para hacer requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const config = { ...defaultOptions, ...options };

        try {
            const response = await fetch(url, config);

            // Verificar el Content-Type antes de parsear
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Expected JSON but received:', contentType, text.substring(0, 100));
                throw new Error(`El servidor devolvió un formato inesperado. Status: ${response.status}`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // ==================== SALAS ====================

    // Obtener todas las salas
    async getSalas() {
        return await this.request('/salas');
    }

    // Obtener sala por ID
    async getSala(id) {
        return await this.request(`/salas/${id}`);
    }

    // ==================== HORARIOS ====================

    // Obtener horarios disponibles
    async getHorarios() {
        return await this.request('/horarios');
    }

    // ==================== RESERVAS ====================

    // Crear nueva reserva
    async crearReserva(reservaData) {
        return await this.request('/reservas', {
            method: 'POST',
            body: JSON.stringify(reservaData)
        });
    }

    // Obtener reservas de un usuario
    async getReservasUsuario(userId) {
        return await this.request(`/reservas/${userId}`);
    }

    // Obtener todas las reservas
    async getReservas() {
        return await this.request('/reservas');
    }

    // Obtener todas las reservas (de todos los usuarios)
    async getTodasLasReservas() {
        return await this.request('/reservas');
    }

    // Actualizar reserva
    async actualizarReserva(id, datos) {
        return await this.request(`/reservas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    // Eliminar/Cancelar reserva
    async eliminarReserva(id) {
        return await this.request(`/reservas/${id}`, {
            method: 'DELETE'
        });
    }

    // Alias para compatibilidad
    async cancelarReserva(id) {
        return await this.eliminarReserva(id);
    }

    // Cancelar reserva
    async cancelarReserva(id) {
        return await this.request(`/reservas/${id}`, {
            method: 'DELETE'
        });
    }

    // ==================== USUARIOS ====================

    // Obtener perfil de usuario
    async getUsuario(id) {
        return await this.request(`/usuarios/${id}`);
    }

    // Actualizar perfil de usuario
    async actualizarUsuario(id, datos) {
        return await this.request(`/usuarios/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    }

    // ==================== VALIDACIONES ====================

    // Validar horario de reserva
    async validarHorario(startTime, duration) {
        return await this.request('/validate-booking', {
            method: 'POST',
            body: JSON.stringify({ startTime, duration })
        });
    }

    // ==================== ESTADÍSTICAS ====================

    // Obtener estadísticas
    async getStats() {
        return await this.request('/stats');
    }

    // ==================== HEALTH CHECK ====================

    // Verificar estado del servidor
    async healthCheck() {
        return await this.request('/health');
    }

    // ==================== ADMINISTRACIÓN ====================

    // Crear nueva sala (solo admin)
    async crearSala(salaData) {
        return await this.request('/admin/salas', {
            method: 'POST',
            body: JSON.stringify(salaData)
        });
    }

    // Eliminar sala (solo admin)
    async eliminarSala(id, userId) {
        return await this.request(`/admin/salas/${id}?userId=${userId}`, {
            method: 'DELETE'
        });
    }

    // ==================== DISPONIBILIDAD ====================

    // Obtener disponibilidad de todas las salas
    async getDisponibilidad(fecha = null) {
        const endpoint = fecha ? `/disponibilidad?fecha=${fecha}` : '/disponibilidad';
        return await this.request(endpoint);
    }

    // Obtener reservas activas de un usuario
    async getReservasActivas(userId) {
        return await this.request(`/reservas/usuario/${userId}/activas`);
    }

    // ==================== USUARIOS ====================

    // Verificar información de usuario (incluyendo rol)
    async verificarAdmin(userId) {
        return await this.request(`/user/${userId}`);
    }
}

// Instancia global de la API
window.api = new ApiClient();

// ==================== FUNCIONES DE UTILIDAD ====================

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    // Colores según tipo
    const colors = {
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 5 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Función para manejar errores de API
function handleApiError(error) {
    console.error('API Error:', error);
    showNotification(error.message || 'Error en la conexión con el servidor', 'error');
}

// Función para mostrar modal de confirmación personalizado
function showConfirmModal(message, onConfirm, onCancel) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'confirm-modal-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;

    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.style.cssText = `
        background-color: white;
        border-radius: 16px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        text-align: center;
    `;

    // Icono de advertencia
    const icon = document.createElement('div');
    icon.style.cssText = `
        width: 64px;
        height: 64px;
        margin: 0 auto 1.5rem;
        background-color: #FEF3C7;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
    `;
    icon.innerHTML = '⚠️';

    // Mensaje
    const messageEl = document.createElement('p');
    messageEl.style.cssText = `
        font-size: 1.1rem;
        color: #1E1E1E;
        margin-bottom: 2rem;
        line-height: 1.6;
        font-weight: 500;
    `;
    messageEl.textContent = message;

    // Botones
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        gap: 1rem;
        justify-content: center;
    `;

    // Botón Cancelar
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.style.cssText = `
        padding: 0.75rem 2rem;
        border: 2px solid #E5E7EB;
        background-color: white;
        color: #6B7280;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    cancelBtn.onmouseover = () => {
        cancelBtn.style.backgroundColor = '#F9FAFB';
        cancelBtn.style.borderColor = '#D1D5DB';
    };
    cancelBtn.onmouseout = () => {
        cancelBtn.style.backgroundColor = 'white';
        cancelBtn.style.borderColor = '#E5E7EB';
    };

    // Botón Confirmar
    const confirmBtn = document.createElement('button');
    confirmBtn.textContent = 'Sí, cancelar';
    confirmBtn.style.cssText = `
        padding: 0.75rem 2rem;
        border: none;
        background-color: #EF4444;
        color: white;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
    `;
    confirmBtn.onmouseover = () => {
        confirmBtn.style.backgroundColor = '#DC2626';
    };
    confirmBtn.onmouseout = () => {
        confirmBtn.style.backgroundColor = '#EF4444';
    };

    // Eventos
    const closeModal = () => {
        overlay.style.animation = 'fadeOut 0.2s ease';
        modal.style.animation = 'slideDown 0.3s ease';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 200);
    };

    cancelBtn.onclick = () => {
        closeModal();
        if (onCancel) onCancel();
    };

    confirmBtn.onclick = () => {
        closeModal();
        if (onConfirm) onConfirm();
    };

    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeModal();
            if (onCancel) onCancel();
        }
    };

    // Agregar elementos
    buttonsContainer.appendChild(cancelBtn);
    buttonsContainer.appendChild(confirmBtn);
    modal.appendChild(icon);
    modal.appendChild(messageEl);
    modal.appendChild(buttonsContainer);
    overlay.appendChild(modal);

    // Agregar estilos de animación si no existen
    if (!document.getElementById('confirm-modal-styles')) {
        const style = document.createElement('style');
        style.id = 'confirm-modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            @keyframes slideDown {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(20px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Agregar al DOM
    document.body.appendChild(overlay);

    // Focus en botón de cancelar por defecto
    cancelBtn.focus();
}

// Función para formatear fechas
function formatDate(dateString) {
    // Parsear la fecha manualmente para evitar problemas de zona horaria
    // Formato esperado: YYYY-MM-DD
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month es 0-indexed en Date
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para formatear horarios
function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// ==================== FUNCIONES ESPECÍFICAS PARA RESERVAS ====================

// Cargar salas en la página
async function loadSalas() {
    try {
        const response = await window.api.getSalas();
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        handleApiError(error);
        return [];
    }
}

// Cargar reservas de usuario
async function loadReservasUsuario(userId) {
    try {
        const response = await window.api.getReservasUsuario(userId);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        handleApiError(error);
        return [];
    }
}

// Crear reserva
async function createReserva(reservaData) {
    try {
        const response = await window.api.crearReserva(reservaData);
        if (response.success) {
            showNotification('Reserva creada exitosamente', 'success');
            return response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        handleApiError(error);
        return null;
    }
}

// Cancelar reserva
async function cancelReserva(reservaId) {
    try {
        const response = await window.api.cancelarReserva(reservaId);
        if (response.success) {
            showNotification('Reserva cancelada exitosamente', 'success');
            return true;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        handleApiError(error);
        return false;
    }
}

// Cancelar reserva activa y recargar página
async function cancelarReservaActiva(reservaId) {
    return new Promise((resolve) => {
        showConfirmModal(
            '¿Estás seguro de que quieres cancelar esta reserva?',
            async () => {
                try {
                    const cancelada = await cancelReserva(reservaId);
                    if (cancelada) {
                        const user = window.auth.getCurrentUser();
                        if (!user) {
                            resolve(false);
                            return;
                        }

                        // Recargar reservas activas
                        const reservasActivas = await loadReservasActivas(user.uid);

                        // Actualizar UI según la página actual
                        if (window.location.pathname === '/rooms' || window.location.pathname === '/room-details') {
                            // Página de salas
                            displayReservasActivas(reservasActivas);
                            setTimeout(() => {
                                initSalasPage();
                            }, 500);
                        } else if (window.location.pathname === '/reservations') {
                            // Página de reservas
                            if (typeof displayReservasActivasEnReservas === 'function') {
                                displayReservasActivasEnReservas(reservasActivas);
                            }

                            // Habilitar formulario si no hay reservas activas
                            if (reservasActivas.length === 0) {
                                const horarioSelect = document.getElementById('horario');
                                const duracionSelect = document.getElementById('duracion');
                                const submitBtn = document.getElementById('submitBtn');

                                if (horarioSelect) horarioSelect.disabled = false;
                                if (duracionSelect) duracionSelect.disabled = false;
                                if (submitBtn) submitBtn.disabled = false;

                                // Ocultar mensaje de advertencia
                                const warningMessages = document.querySelectorAll('.warning-message');
                                warningMessages.forEach(msg => msg.remove());
                            }
                        } else {
                            // Otras páginas - solo recargar reservas activas
                            displayReservasActivas(reservasActivas);
                        }
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                } catch (error) {
                    console.error('Error al cancelar reserva:', error);
                    resolve(false);
                }
            },
            () => {
                // Usuario canceló
                resolve(false);
            }
        );
    });
}

// ==================== FUNCIONES PARA PÁGINAS ESPECÍFICAS ====================

// Inicializar página de salas
async function initSalasPage() {
    const salasContainer = document.getElementById('salas-container');

    if (!salasContainer) {
        console.error('Container de salas no encontrado');
        return;
    }

    try {
        // Cargar salas y disponibilidad
        const [salas, disponibilidad] = await Promise.all([
            loadSalas(),
            loadDisponibilidad()
        ]);

        // Crear mapa de disponibilidad por sala ID
        const disponibilidadMap = {};
        if (disponibilidad && disponibilidad.length > 0) {
            disponibilidad.forEach(item => {
                disponibilidadMap[item.sala.id] = item;
            });
        }

        // Cargar reservas activas del usuario si está autenticado
        let reservasActivas = [];
        let tieneReservaActiva = false;

        if (window.auth && window.auth.isAuthenticated()) {
            const user = window.auth.getCurrentUser();
            if (user) {
                reservasActivas = await loadReservasActivas(user.uid);
                tieneReservaActiva = reservasActivas.length > 0;
                displayReservasActivas(reservasActivas);
            }
        }

        if (salas && salas.length > 0) {
            salasContainer.innerHTML = salas.map(sala => {
                const disp = disponibilidadMap[sala.id];
                const ocupada = disp ? disp.ocupada : false;
                const reservaActual = disp ? disp.reservaActual : null;
                const puedeReservar = !tieneReservaActiva;

                return `
                <div class="room-card">
                    <div class="room-content">
                        <img src="${sala.imagen}" alt="${sala.nombre}" class="room-image">
                        <div class="room-info">
                            <div class="room-header">
                                <h2 class="room-title">${sala.nombre}</h2>
                            </div>
                            <p class="room-description">${sala.descripcion}</p>
                            ${reservaActual ? `
                                <div class="reserva-info">
                                    <strong>Reserva actual:</strong> ${reservaActual.horario} - ${reservaActual.horaFin}<br>
                                    <strong>Propósito:</strong> ${reservaActual.proposito}
                                </div>
                            ` : ''}
                            <div class="room-details">
                                <button 
                                    onclick="reservarSala(${sala.id})" 
                                    class="btn"
                                    ${!puedeReservar ? 'disabled title="Ya tienes una reserva activa"' : ''}
                                    ${ocupada ? 'disabled title="La sala está ocupada"' : ''}
                                >
                                    ${!puedeReservar ? 'Reserva Activa' : ocupada ? 'Ocupada' : 'Reservar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            }).join('');

            // Mostrar advertencia si tiene reserva activa
            if (tieneReservaActiva) {
                const warning = document.createElement('div');
                warning.className = 'warning-message';
                warning.innerHTML = '<strong>⚠️ Tienes una reserva activa.</strong> Debes esperar a que termine antes de hacer una nueva reserva.';
                salasContainer.insertBefore(warning, salasContainer.firstChild);
            }
        } else {
            salasContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                    <p>No se encontraron salas disponibles.</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Verifica que el servidor API esté ejecutándose.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error al cargar salas:', error);
        salasContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #EF4444;">
                <p>Error al cargar las salas.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Por favor, verifica tu conexión o intenta más tarde.</p>
            </div>
        `;
    }
}

// Mostrar reservas activas del usuario
function displayReservasActivas(reservas) {
    const myReservations = document.getElementById('myReservations');
    const reservasActivasContainer = document.getElementById('reservasActivasContainer');

    console.log('displayReservasActivas called with:', reservas);

    if (!myReservations || !reservasActivasContainer) {
        console.error('Containers not found:', { myReservations, reservasActivasContainer });
        return;
    }

    if (reservas.length === 0) {
        console.log('No active reservations to display');
        myReservations.style.display = 'none';
        return;
    }

    console.log('Displaying active reservations section');
    myReservations.style.display = 'block';

    reservasActivasContainer.innerHTML = reservas.map(reserva => {
        // Calcular tiempo restante
        const ahora = new Date();
        const fechaReserva = new Date(reserva.fecha + 'T' + reserva.horaFin);
        const tiempoRestante = fechaReserva - ahora;
        const horasRestantes = Math.floor(tiempoRestante / (1000 * 60 * 60));
        const minutosRestantes = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
        const esActiva = tiempoRestante > 0;

        return `
            <div class="reserva-activa-card" style="background-color: #E6F0FF; border-left: 4px solid #0066FF; padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <h4 style="color: #1E1E1E; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">${reserva.salaNombre}</h4>
                        <span style="background-color: #0066FF; color: white; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Mi reserva</span>
                    </div>
                    <span style="background-color: #D1FAE5; color: #059669; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">Activa</span>
                </div>
                
                <div style="color: #4B5563; font-size: 0.95rem; line-height: 1.6;">
                    <p style="margin-bottom: 0.25rem;"><strong>Usuario:</strong> Usuario</p>
                    <p style="margin-bottom: 0.25rem;"><strong>Fecha:</strong> ${formatDate(reserva.fecha)}</p>
                    <p style="margin-bottom: 0.25rem;"><strong>Horario:</strong> ${formatTime(reserva.horario)} - ${formatTime(reserva.horaFin)}</p>
                    <p style="margin-bottom: 0.25rem;"><strong>Duración:</strong> ${reserva.duracion} horas</p>
                </div>

                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(0,0,0,0.05);">
                    ${esActiva ? `
                        <p style="color: #0066FF; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;">
                            ⏱️ Tiempo restante: ${horasRestantes}h ${minutosRestantes}m
                        </p>
                        <div style="margin-top: 1rem;">
                            <button onclick="cancelarReservaActiva(${reserva.id})" class="btn-cancel-reserva" type="button" style="width: 100%; background-color: #EF4444; color: white; padding: 0.75rem; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; transition: background-color 0.2s;">
                                🗑️ Eliminar Reserva
                            </button>
                        </div>
                    ` : `
                        <p style="color: #059669; font-weight: 600;">✅ Reserva finalizada</p>
                        <div style="margin-top: 1rem;">
                            <button onclick="cancelarReservaActiva(${reserva.id})" class="btn-cancel-reserva" type="button" style="width: 100%; background-color: #EF4444; color: white; padding: 0.75rem; border-radius: 8px; font-weight: 600; border: none; cursor: pointer;">
                                🗑️ Eliminar Reserva
                            </button>
                        </div>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

// Inicializar página de perfil
async function initProfilePage() {
    // Verificar autenticación
    if (!window.auth || !window.auth.isAuthenticated()) {
        window.location.href = '/login';
        return;
    }

    const user = window.auth.getCurrentUser();
    if (!user) return;

    // Cargar datos del usuario
    try {
        const response = await window.api.getUsuario(user.uid);
        if (response.success) {
            updateUserProfile(response.data);
        }
    } catch (error) {
        console.log('Usuario no encontrado en la base de datos, usando datos de Firebase');
        updateUserProfile({
            id: user.uid,
            email: user.email,
            nombre: user.displayName || user.email.split('@')[0],
            telefono: '',
            fechaRegistro: new Date().toISOString()
        });
    }

    // Cargar reservas del usuario
    const reservas = await loadReservasUsuario(user.uid);
    updateReservasList(reservas);
}

// Actualizar perfil de usuario en la UI
function updateUserProfile(userData) {
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const phoneInput = document.getElementById('userPhone');

    if (nameInput) nameInput.value = userData.nombre || '';
    if (emailInput) emailInput.value = userData.email || '';
    if (phoneInput) phoneInput.value = userData.telefono || '';
}

// Actualizar lista de reservas en la UI
function updateReservasList(reservas) {
    const reservasContainer = document.getElementById('reservas-container');

    if (reservasContainer) {
        if (reservas.length === 0) {
            reservasContainer.innerHTML = `
                <div class="no-reservas">
                    <p>No tienes reservas aún</p>
                    <a href="/rooms" class="btn">Ver Salas</a>
                </div>
            `;
        } else {
            reservasContainer.innerHTML = reservas.map(reserva => `
                <div class="reserva-card">
                    <div class="reserva-header">
                        <h3>${reserva.salaNombre}</h3>
                        <span class="estado ${reserva.estado}">${reserva.estado}</span>
                    </div>
                    <div class="reserva-details">
                        <p><strong>Fecha:</strong> ${formatDate(reserva.fecha)}</p>
                        <p><strong>Horario:</strong> ${formatTime(reserva.horario)}</p>
                        <p><strong>Duración:</strong> ${reserva.duracion} horas</p>
                        <p><strong>Propósito:</strong> ${reserva.proposito}</p>
                        <p><strong>Participantes:</strong> ${reserva.participantes}</p>
                        ${reserva.notas ? `<p><strong>Notas:</strong> ${reserva.notas}</p>` : ''}
                    </div>
                    <div class="reserva-actions">
                        <button onclick="cancelReserva(${reserva.id})" class="btn-cancel">Cancelar</button>
                    </div>
                </div>
            `).join('');
        }
    }
}

// Función para reservar sala
function reservarSala(salaId) {
    console.log('reservarSala llamado para sala:', salaId);

    // Simplemente redirigir a la página de reservas - la validación de auth se hará ahí
    // Esto evita problemas de timing con la inicialización de Firebase
    window.location.href = `/reservations?sala=${salaId}`;
}

// ==================== INICIALIZACIÓN ====================

// Verificar conexión con la API al cargar la página
document.addEventListener('DOMContentLoaded', async function () {
    try {
        await window.api.healthCheck();
        console.log('✅ API connection successful');
    } catch (error) {
        console.error('❌ API connection failed:', error);
        showNotification('Error de conexión con el servidor', 'error');
    }
});

// ==================== FUNCIONES ADICIONALES ====================

// Cargar disponibilidad
async function loadDisponibilidad(fecha = null) {
    try {
        const response = await window.api.getDisponibilidad(fecha);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        handleApiError(error);
        return [];
    }
}

// Cargar reservas activas del usuario
async function loadReservasActivas(userId) {
    console.log('loadReservasActivas called for user:', userId);
    try {
        const response = await window.api.getReservasActivas(userId);
        console.log('loadReservasActivas response:', response);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        console.error('Error in loadReservasActivas:', error);
        handleApiError(error);
        return [];
    }
}

// Verificar si usuario es admin
async function verificarRolAdmin(userId) {
    try {
        const response = await window.api.verificarAdmin(userId);
        if (response.success) {
            return response.data.role === 'admin';
        }
        return false;
    } catch (error) {
        console.error('Error verificando rol admin:', error);
        return false;
    }
}

// Cargar todas las reservas (de todos los usuarios)
async function loadTodasLasReservas() {
    try {
        const response = await window.api.getTodasLasReservas();
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        handleApiError(error);
        return [];
    }
}

// Exportar funciones globalmente
window.loadSalas = loadSalas;
window.loadReservasUsuario = loadReservasUsuario;
window.loadTodasLasReservas = loadTodasLasReservas;
window.createReserva = createReserva;
window.cancelReserva = cancelReserva;
window.cancelarReservaActiva = cancelarReservaActiva;
window.showConfirmModal = showConfirmModal;
window.initSalasPage = initSalasPage;
window.initProfilePage = initProfilePage;
window.reservarSala = reservarSala;
window.showNotification = showNotification;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.loadDisponibilidad = loadDisponibilidad;
window.loadReservasActivas = loadReservasActivas;
window.verificarRolAdmin = verificarRolAdmin;
window.displayReservasActivas = displayReservasActivas;
