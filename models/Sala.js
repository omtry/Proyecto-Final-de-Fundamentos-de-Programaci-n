// models/Sala.js
const mongoose = require('mongoose');

const SalaSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  capacidad: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    default: '/img/201.jpeg'
  },
  disponible: {
    type: Boolean,
    default: true
  },
  equipamiento: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Sala', SalaSchema);
