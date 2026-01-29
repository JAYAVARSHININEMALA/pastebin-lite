import mongoose from "mongoose";

const PasteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
  maxViews: { type: Number, default: null },
  views: { type: Number, default: 0 },
});

export default mongoose.models.Paste ||
  mongoose.model("Paste", PasteSchema);
