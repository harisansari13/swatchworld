const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  category: { 
    type: String, 
    enum: ['Pothole', 'Garbage Accumulation', 'Road Crack', 'Damaged Streetlight', 'Water Leakage', 'General Damage'],
    required: true 
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  confidence: { type: Number, default: 0.92 },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: 'Geotagged Location' },
    ward: { type: String, default: 'Ward 4 - Urban Center' }
  },
  imageUrl: { type: String, required: true },
  proofUrl: { type: String, default: null }, // Before/After proof uploaded by admin
  resolutionNotes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved'], 
    default: 'Pending' 
  },
  reporter: {
    name: { type: String, default: 'Anonymous Citizen' },
    phone: { type: String, default: '9876543210' },
    pointsEarned: { type: Number, default: 50 }
  },
  isDuplicate: { type: Boolean, default: false },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', default: null },
  reportsCount: { type: Number, default: 1 },
  aiBoundingBox: {
    x: { type: Number, default: 15 },
    y: { type: Number, default: 20 },
    width: { type: Number, default: 70 },
    height: { type: Number, default: 60 },
    label: { type: String, default: 'Detected Issue' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', ComplaintSchema);
