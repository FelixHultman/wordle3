import mongoose from 'mongoose';

const Item = mongoose.model('item', {
  label: String,
  completed: Boolean,
});

export { Item };
