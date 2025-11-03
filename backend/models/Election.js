import mongoose from 'mongoose';

const electionSchema = mongoose.Schema({
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidate' }],
});

export default mongoose.model('Election', electionSchema);
