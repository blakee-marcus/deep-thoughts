const { Schema } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema(
  {
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    }
  },
  {
    toJSON: {
      getters: true
    }
  }
);

module.exports = reactionSchema;
