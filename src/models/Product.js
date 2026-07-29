import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, enum: ['CUP', 'USD'], default: 'CUP' },
    stock: { type: Number, default: 0 },
    whatsapp: { type: String }, // número con código de país
    image: { type: String },
    description: { type: String },
    type: { type: String, enum: ['product', 'service'], default: 'product' },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Product', productSchema)