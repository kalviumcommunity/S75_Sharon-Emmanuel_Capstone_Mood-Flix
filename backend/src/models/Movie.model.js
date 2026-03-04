import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  overview: {
    type: String,
    default: ''
  },
  releaseDate: {
    type: Date
  },
  posterPath: {
    type: String
  },
  backdropPath: {
    type: String
  },
  genres: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  voteCount: {
    type: Number,
    default: 0
  },
  popularity: {
    type: Number,
    default: 0
  },
  runtime: {
    type: Number
  },
  tagline: {
    type: String
  },
  streamingInfo: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Movie', movieSchema);
