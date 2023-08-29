const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const notificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      required: true,
      enum: ['follow', 'like', 'reply'],
    },
    notificationDate: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    reactionText: {
      type: String
    },
    fromUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    forUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedThought: {
      type: Schema.Types.ObjectId,
      ref: 'Thought',
    }
  }
);

const Notification = model('Notification', notificationSchema);
module.exports = Notification;
