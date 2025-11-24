
function calcularHoraFin(horario, duracion) {
    const [hora, minuto] = horario.split(':').map(Number);
    const duracionMinutos = duracion * 60;
    const totalMinutos = (hora * 60) + minuto + duracionMinutos;
    const horaFin = Math.floor(totalMinutos / 60);
    const minutoFin = totalMinutos % 60;
    return `${horaFin.toString().padStart(2, '0')}:${minutoFin.toString().padStart(2, '0')}`;
}

function esReservaActiva(reserva) {
    const ahora = new Date();
    const fechaActual = ahora.toISOString().split('T')[0]; // YYYY-MM-DD
    const horaActual = ahora.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

    console.log('--- Debugging esReservaActiva ---');
    console.log(`Fecha Actual: ${fechaActual}`);
    console.log(`Hora Actual: ${horaActual}`);
    console.log(`Reserva Fecha: ${reserva.fecha}`);
    console.log(`Reserva Hora Fin: ${reserva.horaFin}`);

    // Si la fecha de la reserva es pasada, no está activa
    if (reserva.fecha < fechaActual) {
        console.log('Result: Date is in the past');
        return false;
    }

    // Si la fecha es futura, está activa
    if (reserva.fecha > fechaActual) {
        console.log('Result: Date is in the future (ACTIVE)');
        return true;
    }

    // Si la fecha es hoy, verificar si la hora actual es menor a la hora de fin
    if (reserva.fecha === fechaActual) {
        // Calcular hora de fin correctamente
        let horaFin = reserva.horaFin;
        // Si horaFin no existe o tiene formato incorrecto, calcularla
        if (!horaFin || !/^\d{2}:\d{2}$/.test(horaFin)) {
            horaFin = calcularHoraFin(reserva.horario, reserva.duracion);
        }

        // Comparar horas en formato HH:MM
        const [horaAct, minAct] = horaActual.split(':').map(Number);
        const [horaFinNum, minFin] = horaFin.split(':').map(Number);

        const minutosActuales = horaAct * 60 + minAct;
        const minutosFin = horaFinNum * 60 + minFin;

        console.log(`Minutes current: ${minutosActuales}, Minutes end: ${minutosFin}`);

        if (minutosActuales < minutosFin) {
            console.log('Result: Time is within reservation (ACTIVE)');
            return true;
        } else {
            console.log('Result: Time is past reservation (FINISHED)');
            return false;
        }
    }

    return false;
}

const reserva = {
    "id": 1763944097119,
    "userId": "b5VsPddGlPW0XUSRGRxLGQQ44Pn1",
    "salaId": 1,
    "salaNombre": "Sala 201",
    "fecha": "2025-11-24",
    "horario": "16:00",
    "duracion": 2,
    "horaFin": "18:00",
    "proposito": "Sesión de mentoría",
    "participantes": 4,
    "notas": "",
    "estado": "confirmada",
    "fechaCreacion": "2025-11-24T00:28:17.119Z"
};

console.log('Is active?', esReservaActiva(reserva));
