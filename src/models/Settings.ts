import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  shopTitle: {
    type: String,
    default: ''
  },
  shopSubtitle: {
    type: String,
    default: ''
  },
  bannerText: {
    type: String,
    default: ''
  },
  titleStyle: {
    type: String,
    default: 'glow'
  },
  scrollingText: {
    type: String,
    default: ''
  },
  backgroundImage: {
    type: String,
    default: ''
  },
  backgroundOpacity: {
    type: Number,
    default: 20
  },
  backgroundBlur: {
    type: Number,
    default: 5
  }
}, {
  timestamps: true
});

export default mongoose.models.Settings || mongoose.model('Settings', settingsSchema);