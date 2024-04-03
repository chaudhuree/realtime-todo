const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: [true, 'Please provide todo'],
    maxlength: 50,
    minlength: 3,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Todo', TodoSchema)