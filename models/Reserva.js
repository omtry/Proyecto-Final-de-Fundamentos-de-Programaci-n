// models/Reserva.js
const mongoose = require('mongoose');

const ReservaSchema = new mongoose.Schema({
  // ID numérico que usa el frontend (para PUT/DELETE)
  id: {
    type: Number,
    required: true,
    unique: true
  },
    userName: { type: String },
  userEmail: { type: String },
  userId: { type: String, required: true },      // uid de Firebase
  salaId: { type: Number, required: true },      // 1..7
  salaNombre: { type: String, required: true },  // "Sala 201", etc.
  fecha: { type: String, required: true },       // "2025-11-24"
  horario: { type: String, required: true },     // "15:00"
  duracion: { type: Number, required: true },    // 1 o 2 horas
  horaFin: { type: String, required: true },     // "16:00"
  proposito: { type: String, default: '' },
  participantes: { type: Number, default: 1 },
  notas: { type: String, default: '' },
  estado: {
    type: String,
    enum: ['confirmada', 'cancelada'],
    default: 'confirmada'
  },
  fechaCreacion: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Reserva', ReservaSchema);
