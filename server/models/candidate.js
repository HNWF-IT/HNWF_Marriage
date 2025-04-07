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
    enum: ["Single", "Married", "Divorced", "Widow"], 
    required: true 
  },
  muslimStatus: { 
    type: String, 
    enum: ["Born", "Reverted"], 
    required: true 
  },
  dob: { type: Date, required: true },
  height: { type: String, required: true },
  sourceOfIncome: { type: String, required: true },
  qualification: { 
    type: String, 
    enum: ["Below Matric", "Matric", "Inter", "Bachelors", "Masters", "Phd", "Aalim"], 
    required: true 
  },
  caste: { type: String, required: true },
  maslak: { 
    type: String, 
    enum: ["Ahl E Hadees", "Deoband", "Barelvi", "Shia", "Other"], 
    required: true 
  },
  healthCondition: { type: String, required: true },
  fatherOccupation: { type: String },
  mother: { type: String },
  siblingsCount: { type: String, required: true },
  houseSize: { type: String, required: true },
  houseOwnership: { 
    type: String, 
    enum: ["Own", "Rent"], 
    required: true 
  },
  contact: { type: String, required: true },
  careOfContact: { type: String, required: true },
  nationality: { 
    type: String, 
    enum: ["Pakistani", "Non-Pakistani"], 
    required: true 
  },
  city: { type: String, required: true },
  address: { type: String, required: true },
});

// Create the model from the schema
const Candidate = mongoose.model('Candidate', candidateSchema);

// Export the model
module.exports = Candidate;