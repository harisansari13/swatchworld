const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { analyzeImage } = require('../utils/aiDetector');
const { findDuplicateComplaint } = require('../utils/geoClustering');

// In-memory fallback database if MongoDB is not connected
let memoryComplaints = [];

function setMemoryStore(initialData) {
  memoryComplaints = [...initialData];
}

// GET all complaints with optional filtering
router.get('/', async (req, res) => {
  try {
    const { category, status, severity, search } = req.query;
    
    // Check if Mongoose is connected
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category && category !== 'All') query.category = category;
      if (status && status !== 'All') query.status = status;
      if (severity && severity !== 'All') query.severity = severity;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { 'location.address': { $regex: search, $options: 'i' } }
        ];
      }
      const data = await Complaint.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: data.length, data });
    }

    // In-Memory fallback
    let filtered = memoryComplaints;
    if (category && category !== 'All') filtered = filtered.filter(c => c.category === category);
    if (status && status !== 'All') filtered = filtered.filter(c => c.status === status);
    if (severity && severity !== 'All') filtered = filtered.filter(c => c.severity === severity);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(c => c.title.toLowerCase().includes(q) || (c.location.address || '').toLowerCase().includes(q));
    }

    res.json({ success: true, count: filtered.length, data: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST AI Scan Preview (YOLOv8 Simulation)
router.post('/ai-scan', (req, res) => {
  try {
    const { imageFilename, userCategoryHint } = req.body;
    const aiResult = analyzeImage(imageFilename, userCategoryHint);
    res.json({ success: true, aiResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST Submit New Geotagged Complaint
router.post('/', async (req, res) => {
  try {
    const { title, description, category, severity, confidence, location, imageUrl, reporterName, reporterPhone, aiBoundingBox } = req.body;

    if (!location || !location.lat || !location.lng) {
      return res.status(400).json({ success: false, error: "GPS Location (lat/lng) is required." });
    }

    // Fetch existing open complaints to check GPS duplicate clustering (10m radius)
    const mongoose = require('mongoose');
    let existingList = [];
    if (mongoose.connection.readyState === 1) {
      existingList = await Complaint.find({ status: { $ne: 'Resolved' } });
    } else {
      existingList = memoryComplaints.filter(c => c.status !== 'Resolved');
    }

    // Check duplicate
    const dupCheck = findDuplicateComplaint(location.lat, location.lng, category, existingList, 15);

    if (dupCheck.isDuplicate && dupCheck.originalComplaint) {
      // Merge with existing complaint
      const orig = dupCheck.originalComplaint;
      orig.reportsCount = (orig.reportsCount || 1) + 1;
      
      // Upgrade severity if duplicate count increases
      if (orig.reportsCount >= 3 && orig.severity === 'Low') orig.severity = 'Medium';
      if (orig.reportsCount >= 5 && orig.severity === 'Medium') orig.severity = 'High';

      if (mongoose.connection.readyState === 1) {
        await Complaint.findByIdAndUpdate(orig._id, { 
          reportsCount: orig.reportsCount, 
          severity: orig.severity 
        });
      }

      return res.json({
        success: true,
        isDuplicate: true,
        message: `Anti-Spam Clustering: This issue was already reported within ${dupCheck.distanceMeters} meters. Added your vote to Priority Ticket #${orig._id || orig.id}.`,
        complaint: orig
      });
    }

    // Create New Ticket
    const newDoc = {
      _id: 'c_' + Date.now(),
      title: title || `${category} reported near ${location.address || 'GPS Coordinates'}`,
      description: description || '',
      category: category || 'Pothole',
      severity: severity || 'Medium',
      confidence: confidence || 0.93,
      location: {
        lat: location.lat,
        lng: location.lng,
        address: location.address || `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`,
        ward: location.ward || 'Ward 4 - Smart City Hub'
      },
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      proofUrl: null,
      status: 'Pending',
      reporter: {
        name: reporterName || 'Civic Citizen',
        phone: reporterPhone || '9876543210',
        pointsEarned: 50
      },
      reportsCount: 1,
      aiBoundingBox: aiBoundingBox || { x: 20, y: 20, width: 60, height: 60, label: category },
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      const created = await Complaint.create(newDoc);
      return res.status(201).json({ success: true, isDuplicate: false, complaint: created });
    }

    memoryComplaints.unshift(newDoc);
    res.status(201).json({ success: true, isDuplicate: false, complaint: newDoc });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT Update Status & Upload Proof of Resolution
router.get('/leaderboard', async (req, res) => {
  const leaderboard = [
    { rank: 1, name: "Aarav Sharma", points: 450, reportsResolved: 8, badge: "Civic Champion 🏆" },
    { rank: 2, name: "Sneha Kulkarni", points: 380, reportsResolved: 6, badge: "Road Savior 🛣️" },
    { rank: 3, name: "Priya Patel", points: 310, reportsResolved: 5, badge: "Clean City Guardian 🌿" },
    { rank: 4, name: "Rahul Deshmukh", points: 260, reportsResolved: 4, badge: "Swachh Hero 🦸" },
    { rank: 5, name: "Vikas Shinde", points: 200, reportsResolved: 3, badge: "Active Citizen 🌟" }
  ];
  res.json({ success: true, leaderboard });
});

router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, proofUrl, resolutionNotes } = req.body;

    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      const updated = await Complaint.findByIdAndUpdate(
        id, 
        { status, proofUrl: proofUrl || null, resolutionNotes: resolutionNotes || '' },
        { new: true }
      );
      return res.json({ success: true, complaint: updated });
    }

    // In-memory fallback
    const idx = memoryComplaints.findIndex(c => String(c._id) === String(id));
    if (idx !== -1) {
      memoryComplaints[idx].status = status;
      if (proofUrl) memoryComplaints[idx].proofUrl = proofUrl;
      if (resolutionNotes) memoryComplaints[idx].resolutionNotes = resolutionNotes;
      return res.json({ success: true, complaint: memoryComplaints[idx] });
    }

    res.status(404).json({ success: false, error: "Complaint not found" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = { router, setMemoryStore };
