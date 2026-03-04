import mongoose from 'mongoose';

const watchlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  watched: {
    type: Boolean,
    default: false
  },
  watchedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Ensure one movie per user in watchlist
watchlistSchema.index({ user: 1, movie: 1 }, { unique: true });

export default mongoose.model('Watchlist', watchlistSchema);
