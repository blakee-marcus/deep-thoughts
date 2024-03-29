const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: 'You need to leave a thought!',
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  },
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

thoughtSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
