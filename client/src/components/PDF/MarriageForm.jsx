import React from "react";
import "./MarriageForm.css"; // Import the CSS file

const MarriageForm = () => {
  // Initial data object with all fields from the form
  const formData = {
    photo: null,
    date: "",
    name: "formData.name",
    fatherName: "formData.fatherName",
    gender: "formData.gender",
    maritalStatus: "formData.maritalStatus",
    age: "formData.age",
    height: "formData.height",
    sourceOfIncome: "formData.sourceOfIncome",
    qualification: "formData.qualification",
    caste: "formData.caste",
    maslak: "formData.maslak",
    healthCondition: "formData.healthCondition",
    fatherOccupation: "formData.fatherOccupation",
    mother: "formData.mother",
    siblingsInfo: "fomrData.siblingsInfo",
    houseSize: "formData.houseSize",
    houseOwnership: "formData.houseOwnership",
    contact: "formData.contact",
    contactPerson: "formData.contactPerson",
    nationality: "formData.national",
    address: "formData.address",
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="form-container">
      {/* Print button */}
      <div className="print-button">
        <button onClick={handlePrint}>🖨️ Print Form</button>
      </div>

      <div className="form-wrapper">
        {/* Header */}
        <h1 className="form-title">Huqooq un Naas Marriage Form</h1>

        <div className="header-section">
          <div className="photo-container">
            <p>Photo</p>
          </div>
          <div className="header-info">
            <p className="date-line">Date:_______________________</p>
            <p className="subtitle">
              Dua for Bride & Groom after Marriage/Nikah
            </p>
            <p className="arabic-text">
              بارك الله لك وبارك عليكما وجمع بينكما في خير
            </p>
            <p className="blessing-text">
              Allah Azzawajal bless you and shower send blessing on you and
              place, goodness between both of you
            </p>
            <div className="emoji-container">
              <span className="heart-emoji">❤</span>
              <span className="bride-emoji">👰</span>
              <span className="groom-emoji">🤵</span>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <h2 className="section-title">Personal Information</h2>

        <table className="info-table">
          <tbody>
            {[
              ["Name", "asif"],
              ["Father Name", "Father Name"],
              ["Gender", "gender"],
              ["Marital Status", "Marital Status"],
              ["Age / Date of Birth", "Age"],
              ["Height", "height"],
              ["Sorce of Income", "source Of Income"],
              ["Qualification", "qualification"],
              ["Caste", "caste"],
              ["Maslak", "maslak"],
              ["Health Condition", "healthCondition"],
              ["Father Occupation", "fatherOccupation"],
              ["Mother", "mother"],
              ["How Many Sister & Brothers", "siblingsInfo"],
              ["House Size", "houseSize"],
              ["House (Own / Rent)", "houseOwnership"],
              ["Contact #", "contact"],
              ["C/o Name & Contact #", "contactPerson"],
              ["Nationality", "nationality"],
              ["Address", "address"],
            ].map((row, index) => (
              <tr key={index}>
                <td className="label-cell">{row[0]}</td>
                <td className="value-cell">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarriageForm;
