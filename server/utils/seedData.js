/**
 * Initial Seed Data for SwachhCheck
 * Sample Geotagged Complaints around Parbhani & Smart City Zones
 */

const sampleComplaints = [
  {
    title: "Deep Pothole near Station Road Curve",
    description: "Dangerous pothole creating traffic congestion and risk for two-wheelers near railway station gate.",
    category: "Pothole",
    severity: "Critical",
    confidence: 0.96,
    location: {
      lat: 19.2644,
      lng: 76.7744,
      address: "Station Road, Ward 4, Parbhani",
      ward: "Ward 4 - Railway Sector"
    },
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "Pending",
    reporter: { name: "Aarav Sharma", phone: "9823412345", pointsEarned: 50 },
    reportsCount: 3,
    aiBoundingBox: { x: 20, y: 25, width: 60, height: 50, label: "POTHOLE (96%)" },
    createdAt: new Date(Date.now() - 3600000 * 24 * 2)
  },
  {
    title: "Overflowing Garbage Dump at Main Market",
    description: "Solid waste accumulation spreading on main pedestrian walkway causing bad odor.",
    category: "Garbage Accumulation",
    severity: "High",
    confidence: 0.94,
    location: {
      lat: 19.2680,
      lng: 76.7780,
      address: "Gandhi Market Chowk, Parbhani",
      ward: "Ward 2 - Market Central"
    },
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "In Progress",
    reporter: { name: "Priya Patel", phone: "9876501234", pointsEarned: 50 },
    reportsCount: 5,
    aiBoundingBox: { x: 15, y: 15, width: 70, height: 65, label: "GARBAGE (94%)" },
    createdAt: new Date(Date.now() - 3600000 * 24 * 4)
  },
  {
    title: "Damaged Streetlight Pole #42",
    description: "Pole light flickering and dangling wire post storm near Civil Hospital.",
    category: "Damaged Streetlight",
    severity: "Medium",
    confidence: 0.91,
    location: {
      lat: 19.2610,
      lng: 76.7700,
      address: "Civil Hospital Road, Parbhani",
      ward: "Ward 6 - Hospital Zone"
    },
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "Pending",
    reporter: { name: "Rahul Deshmukh", phone: "9811223344", pointsEarned: 50 },
    reportsCount: 1,
    aiBoundingBox: { x: 30, y: 10, width: 40, height: 80, label: "STREETLIGHT (91%)" },
    createdAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    title: "Major Asphalt Road Surface Crack",
    description: "Cracks expanding rapidly due to heavy rain drainage flow.",
    category: "Road Crack",
    severity: "Medium",
    confidence: 0.89,
    location: {
      lat: 19.2710,
      lng: 76.7820,
      address: "Shivaji Nagar Highway, Parbhani",
      ward: "Ward 1 - North Sector"
    },
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    proofUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
    resolutionNotes: "Resurfaced with cold asphalt mixture by Ward 1 Maintenance Team.",
    status: "Resolved",
    reporter: { name: "Sneha Kulkarni", phone: "9988776655", pointsEarned: 100 },
    reportsCount: 2,
    aiBoundingBox: { x: 25, y: 35, width: 50, height: 40, label: "CRACK (89%)" },
    createdAt: new Date(Date.now() - 3600000 * 24 * 7)
  },
  {
    title: "Water Pipeline Burst & Road Flooding",
    description: "Main potable water line leaking heavily on arterial road.",
    category: "Water Leakage",
    severity: "High",
    confidence: 0.95,
    location: {
      lat: 19.2630,
      lng: 76.7760,
      address: "Zilla Parishad Road, Parbhani",
      ward: "Ward 3 - Civic Admin Zone"
    },
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=800&q=80",
    proofUrl: null,
    status: "In Progress",
    reporter: { name: "Vikas Shinde", phone: "9765432109", pointsEarned: 50 },
    reportsCount: 4,
    aiBoundingBox: { x: 20, y: 30, width: 60, height: 50, label: "WATER LEAK (95%)" },
    createdAt: new Date(Date.now() - 3600000 * 24 * 1)
  }
];

module.exports = sampleComplaints;
