import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 20
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  categories: {
    type: [String],
    default: ["General"]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

productSchema.virtual('status').get(function() {
  if (this.quantity > 2) return 'available';
  if (this.quantity > 0) return 'low stock';
  return 'out of stock';
});

export default mongoose.model('Product', productSchema);