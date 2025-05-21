const mongoose = require("mongoose");

// Define the candidate schema with updated fields and enums
const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  gender: { 
    type: String, 
    enum: ["Male", "Female"], 
    required: true 
  },
  maritalStatus: { 
    type: String, 
    enum: ["Single", "Married", "Divorced", "Widow", "Other"], 
    required: true 
  },
  muslimStatus: { 
    type: String, 
    enum: ["Born", "Reverted"], 
    required: true 
  },
  dob: { type: Date, required: true },
  height: { type: String },
  incomeAmount: { type: String },
  sourceOfIncome: { type: String },
  qualification: { 
    type: String, 
    enum: ["Below Matric", "Matric", "Inter", "Bachelors", "Masters", "Phd", "Aalim", "Other"], 
    required: true 
  },
  willingStatus: { 
    type: String, 
    enum: ["Done", "Seeking", "On Hold"],
    required: true,
    default: 'LOOKING'
  },
  caste: { type: String },
  maslak: { 
    type: String, 
    enum: ["Ahl E Hadees", "Deoband", "Barelvi", "Shia", "Other"], 
    required: true 
  },
  healthCondition: { type: String },
  fatherOccupation: { type: String },
  mother: { type: String },
  siblingsCount: { type: String, required: true },
  houseSize: { type: String },
  houseOwnership: { 
    type: String, 
    enum: ["Own", "Rent", "Other"]
  },
  contact: { type: String, required: true },
  careOfContact: { type: String },
  nationality: { 
    type: String, 
    enum: ["Pakistani", "Oversea Pakistani", "Foriegner"], 
    required: true 
  },
  city: { type: String, required: true },
  address: { type: String, required: true },
  areaOfResidence: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the model from the schema
const Candidate = mongoose.model('Candidate', candidateSchema);

// Export the model
module.exports = Candidate;