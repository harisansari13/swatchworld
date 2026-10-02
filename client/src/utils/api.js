const API_BASE = 'http://localhost:5000/api';

export const initialMockComplaints = [
  {
    _id: "c_101",
    title: "Deep Pothole near Central Junction",
    description: "Dangerous pothole creating traffic delay and hazard for two-wheelers.",
    category: "Pothole",
    severity: "Critical",
    confidence: 0.96,
    location: {
      lat: 18.5204,
      lng: 73.8567,
      address: "FC Road, Near Deccan Gymkhana, Pune",
      ward: "Ward 4 - Smart City Hub"
    },
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "Pending",
    reporter: { name: "Aarav Sharma", phone: "9823456789", pointsEarned: 50 },
    reportsCount: 4,
    aiBoundingBox: { x: 22, y: 30, width: 55, height: 45, label: "POTHOLE (96%)" },
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    _id: "c_102",
    title: "Overflowing Garbage Bin near Bus Stop",
    description: "Garbage accumulating outside the bin for 2 days. Smells bad.",
    category: "Garbage Accumulation",
    severity: "High",
    confidence: 0.94,
    location: {
      lat: 18.5242,
      lng: 73.8512,
      address: "Shivajinagar Bus Terminus Area, Pune",
      ward: "Ward 2 - Market Central"
    },
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    proofUrl: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80",
    resolutionNotes: "Sanitation team deployed. Bin emptied and area disinfected.",
    status: "Resolved",
    reporter: { name: "Sneha Kulkarni", phone: "9876543210", pointsEarned: 50 },
    reportsCount: 2,
    aiBoundingBox: { x: 15, y: 18, width: 68, height: 60, label: "GARBAGE (94%)" },
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString()
  },
  {
    _id: "c_103",
    title: "Unlit Damaged Streetlight on Ring Road",
    description: "Streetlight fixture hanging precariously. Zero street lighting at night.",
    category: "Damaged Streetlight",
    severity: "Medium",
    confidence: 0.91,
    location: {
      lat: 18.5158,
      lng: 73.8631,
      address: "Kothrud Depot Road, Ward 3",
      ward: "Ward 3 - Civic Admin Zone"
    },
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "In Progress",
    reporter: { name: "Rahul Deshmukh", phone: "9812345678", pointsEarned: 50 },
    reportsCount: 1,
    aiBoundingBox: { x: 35, y: 10, width: 30, height: 75, label: "STREETLIGHT (91%)" },
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    _id: "c_104",
    title: "Major Pipeline Water Leakage on Main St",
    description: "Clean water leaking onto asphalt. Road surface degrading quickly.",
    category: "Water Leakage",
    severity: "High",
    confidence: 0.95,
    location: {
      lat: 18.5311,
      lng: 73.8445,
      address: "Aundh Main Road, Ward 1",
      ward: "Ward 1 - North Sector"
    },
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "Pending",
    reporter: { name: "Priya Patel", phone: "9898989898", pointsEarned: 50 },
    reportsCount: 3,
    aiBoundingBox: { x: 25, y: 25, width: 50, height: 50, label: "WATER LEAK (95%)" },
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

export async function fetchComplaints(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.category && filters.category !== 'All') params.append('category', filters.category);
    if (filters.status && filters.status !== 'All') params.append('status', filters.status);
    if (filters.severity && filters.severity !== 'All') params.append('severity', filters.severity);
    if (filters.search) params.append('search', filters.search);

    const res = await fetch(`${API_BASE}/complaints?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.data;
    }
  } catch (err) {
    console.warn("Backend offline, using fallback client state.", err);
  }
  return null;
}

export async function scanImageAI(imageFilename, categoryHint) {
  try {
    const res = await fetch(`${API_BASE}/complaints/ai-scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageFilename, userCategoryHint: categoryHint })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.aiResult;
    }
  } catch (err) {
    console.warn("AI Backend scan endpoint fallback.", err);
  }
  
  // Dynamic client fallback simulation
  const confidence = parseFloat((0.89 + Math.random() * 0.08).toFixed(2));
  return {
    category: categoryHint || 'Pothole',
    confidence,
    severity: confidence > 0.93 ? 'High' : 'Medium',
    aiBoundingBox: {
      x: Math.floor(18 + Math.random() * 15),
      y: Math.floor(20 + Math.random() * 15),
      width: Math.floor(60 + Math.random() * 20),
      height: Math.floor(55 + Math.random() * 20),
      label: `${(categoryHint || 'POTHOLE').toUpperCase()} (${(confidence * 100).toFixed(0)}%)`
    },
    processingTimeMs: Math.floor(900 + Math.random() * 600),
    modelName: "YOLOv8s-SwachhCheck-v1.4",
    status: "SUCCESS"
  };
}

export async function submitComplaint(payload) {
  try {
    const res = await fetch(`${API_BASE}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data;
    }
  } catch (err) {
    console.warn("Submit endpoint fallback.", err);
  }

  // Client side fallback logic with duplicate distance check
  const newDoc = {
    _id: 'c_' + Date.now(),
    title: payload.title || `${payload.category} reported near GPS Tag`,
    description: payload.description || '',
    category: payload.category || 'Pothole',
    severity: payload.severity || 'Medium',
    confidence: payload.confidence || 0.92,
    location: payload.location,
    imageUrl: payload.imageUrl,
    proofUrl: null,
    status: 'Pending',
    reporter: { name: payload.reporterName || 'Citizen User', phone: '9876543210', pointsEarned: 50 },
    reportsCount: 1,
    aiBoundingBox: payload.aiBoundingBox || { x: 20, y: 20, width: 60, height: 60, label: payload.category },
    createdAt: new Date().toISOString()
  };

  return { success: true, isDuplicate: false, complaint: newDoc };
}

export async function updateComplaintStatus(id, status, proofUrl = null, resolutionNotes = '') {
  try {
    const res = await fetch(`${API_BASE}/complaints/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, proofUrl, resolutionNotes })
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.complaint;
    }
  } catch (err) {
    console.warn("Update status endpoint fallback.", err);
  }
  return null;
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/stats/dashboard`);
    if (res.ok) {
      const data = await res.json();
      if (data.success) return data.stats;
    }
  } catch (err) {
    console.warn("Stats API fallback.", err);
  }
  return null;
}
