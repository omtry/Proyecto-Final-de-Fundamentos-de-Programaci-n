document.addEventListener('DOMContentLoaded', async function () {
    // Verificar si es admin
    if (!window.auth) {
        console.error('Auth module not loaded');
        return;
    }

    // Esperar a que auth se inicialice
    const checkAuth = setInterval(async () => {
        if (window.auth.isAuthenticated()) {
            clearInterval(checkAuth);
            const user = window.auth.getCurrentUser();
            const role = await window.auth.getUserRoleFromFirestore(user.uid);

            if (role !== 'admin') {
                window.location.href = '/';
                return;
            }

            initDashboard(user);
        } else {
            // Si no está autenticado después de un tiempo, redirigir
            setTimeout(() => {
                if (!window.auth.isAuthenticated()) {
                    window.location.href = '/login';
                }
            }, 2000);
        }
    }, 100);
});

let calendar;
let allReservations = [];
let salas = [];

// Colores por sala
const salaColors = {
    1: '#3B82F6', // Sala 201 - Azul
    2: '#10B981', // Sala 202 - Verde
    3: '#F59E0B', // Sala 203 - Amarillo
    4: '#8B5CF6', // Sala 204 - Violeta
    5: '#EF4444', // Sala 205 - Rojo
    6: '#EC4899', // Sala 206 - Rosa
    7: '#6366F1'  // Sala 207 - Indigo
};

async function initDashboard(user) {
    console.log('Initializing Admin Dashboard...');

    // Cargar salas
    try {
        const response = await window.api.getSalas();
        if (response.success) {
            salas = response.data;
            populateRoomFilter();
            populateRoomSelect();
        }
    } catch (error) {
        console.error('Error loading rooms:', error);
    }

    // Inicializar Calendario
    const calendarEl = document.getElementById('calendar');
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        locale: 'es',
        editable: true, // Permitir arrastrar y soltar (implementaremos lógica luego)
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        events: [],
        eventClick: handleEventClick,
        select: handleDateSelect,
        eventDrop: handleEventDrop,
        eventResize: handleEventResize
    });

    calendar.render();

    // Cargar reservas
    await loadReservations(user.uid);

    // Event Listeners
    document.getElementById('roomFilter').addEventListener('change', filterReservations);
    document.getElementById('refreshBtn').addEventListener('click', () => loadReservations(user.uid));

    // Modal listeners
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('deleteBtn').addEventListener('click', handleDeleteReservation);
    document.getElementById('saveBtn').addEventListener('click', handleSaveReservation);
}

async function loadReservations(userId) {
    try {
        const response = await window.api.getAllReservations(userId);
        if (response.success) {
            allReservations = response.data;
            updateCalendarEvents(allReservations);
        }
    } catch (error) {
        console.error('Error loading reservations:', error);
        alert('Error al cargar las reservas');
    }
}

function updateCalendarEvents(reservations) {
    const events = reservations.map(reserva => ({
        id: reserva.id,
        title: `${reserva.salaNombre} - ${reserva.userName}`,
        start: `${reserva.fecha}T${reserva.horario}`,
        end: `${reserva.fecha}T${reserva.horaFin}`,
        backgroundColor: salaColors[reserva.salaId] || '#3788d8',
        borderColor: salaColors[reserva.salaId] || '#3788d8',
        extendedProps: {
            ...reserva
        }
    }));

    calendar.removeAllEvents();
    calendar.addEventSource(events);
}

function populateRoomFilter() {
    const select = document.getElementById('roomFilter');
    salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id;
        option.textContent = sala.nombre;
        select.appendChild(option);
    });
}

function populateRoomSelect() {
    const select = document.getElementById('editSala');
    salas.forEach(sala => {
        const option = document.createElement('option');
        option.value = sala.id;
        option.textContent = sala.nombre;
        select.appendChild(option);
    });
}

function filterReservations() {
    const salaId = document.getElementById('roomFilter').value;

    if (salaId === 'all') {
        updateCalendarEvents(allReservations);
    } else {
        const filtered = allReservations.filter(r => r.salaId === parseInt(salaId));
        updateCalendarEvents(filtered);
    }
}

// ==================== EVENT HANDLERS ====================

let currentEventId = null;

function handleEventClick(info) {
    const event = info.event;
    const props = event.extendedProps;

    currentEventId = props.id;

    // Llenar modal
    document.getElementById('modalTitle').textContent = 'Editar Reserva';
    document.getElementById('editSala').value = props.salaId;
    document.getElementById('editFecha').value = props.fecha;
    document.getElementById('editHorario').value = props.horario;
    document.getElementById('editDuracion').value = props.duracion;
    document.getElementById('editProposito').value = props.proposito;

    // Info usuario
    const userInfo = `
        <strong>Usuario:</strong> ${props.userName}<br>
        <strong>Email:</strong> ${props.userEmail || 'N/A'}<br>
        <strong>ID Usuario:</strong> ${props.userId}
    `;
    document.getElementById('userInfoDetails').innerHTML = userInfo;

    document.getElementById('deleteBtn').style.display = 'block';
    openModal();
}

function handleDateSelect(selectInfo) {
    // Crear nueva reserva
    currentEventId = null;

    document.getElementById('modalTitle').textContent = 'Nueva Reserva';
    document.getElementById('editFecha').value = selectInfo.startStr;
    document.getElementById('editHorario').value = '09:00'; // Default
    document.getElementById('editDuracion').value = '1';
    document.getElementById('editProposito').value = '';
    document.getElementById('userInfoDetails').innerHTML = '<p>Creando reserva como Admin</p>';

    document.getElementById('deleteBtn').style.display = 'none';
    openModal();
}

async function handleEventDrop(info) {
    if (!confirm('¿Confirmar cambio de fecha/hora?')) {
        info.revert();
        return;
    }

    const event = info.event;
    const props = event.extendedProps;

    // Calcular nuevos valores
    const newStart = event.start;
    const fecha = newStart.toISOString().split('T')[0];
    const horario = newStart.toTimeString().slice(0, 5);

    try {
        const user = window.auth.getCurrentUser();
        await window.api.updateReservationAdmin(props.id, {
            fecha,
            horario
        }, user.uid);

        // Recargar para asegurar consistencia
        loadReservations(user.uid);
    } catch (error) {
        console.error('Error updating reservation:', error);
        alert('Error al actualizar la reserva: ' + error.message);
        info.revert();
    }
}

async function handleEventResize(info) {
    // Similar logic for resize (duration change)
    // For now revert as it requires complex duration calculation
    alert('Para cambiar la duración, por favor usa el modal de edición (clic en el evento).');
    info.revert();
}

async function handleSaveReservation() {
    const user = window.auth.getCurrentUser();
    if (!user) return;

    const data = {
        salaId: parseInt(document.getElementById('editSala').value),
        fecha: document.getElementById('editFecha').value,
        horario: document.getElementById('editHorario').value,
        duracion: parseFloat(document.getElementById('editDuracion').value),
        proposito: document.getElementById('editProposito').value
    };

    try {
        if (currentEventId) {
            // Editar
            await window.api.updateReservationAdmin(currentEventId, data, user.uid);
            alert('Reserva actualizada');
        } else {
            // Crear (como admin para sí mismo o placeholder)
            // Nota: Para crear para OTRO usuario, necesitaríamos un selector de usuarios.
            // Por ahora, el admin crea reservas a su nombre.
            const reservaData = {
                ...data,
                userId: user.uid,
                userName: user.displayName || 'Admin',
                userEmail: user.email,
                participantes: 1
            };
            await window.api.crearReserva(reservaData);
            alert('Reserva creada');
        }

        closeModal();
        loadReservations(user.uid);
    } catch (error) {
        console.error('Error saving reservation:', error);
        alert('Error: ' + error.message);
    }
}

async function handleDeleteReservation() {
    if (!currentEventId) return;

    if (!confirm('¿Estás seguro de eliminar esta reserva? Esta acción no se puede deshacer.')) return;

    try {
        const user = window.auth.getCurrentUser();
        await window.api.deleteReservationAdmin(currentEventId, user.uid);
        alert('Reserva eliminada');
        closeModal();
        loadReservations(user.uid);
    } catch (error) {
        console.error('Error deleting reservation:', error);
        alert('Error al eliminar: ' + error.message);
    }
}

function openModal() {
    document.getElementById('reservationModal').classList.add('active');
}

function closeModal() {
    document.getElementById('reservationModal').classList.remove('active');
}
