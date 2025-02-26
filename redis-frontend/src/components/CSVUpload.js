import React, { useState, useRef } from "react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
import "./CSVUpload.css";

const API_URL = "http://localhost:5000/students";

function CSVUpload({ showModal, setShowModal, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [actionType, setActionType] = useState("");

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
      setErrorMessage("");
      previewCSV(file);
    } else {
      setErrorMessage("Invalid file format. Please upload a CSV file.");
      setSelectedFile(null);
    }
  };
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; 
    return date.toISOString().split("T")[0];
  };
  const previewCSV = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        console.log("Raw parsed data:", result.data);

        const csvData = result.data
          .filter(row => Object.values(row).some(value => value?.trim() !== ""))
          .map(student => ({
            id: student.id?.trim() || null,
            name: student.name?.trim() || null,
            age: student.age ? parseInt(student.age.trim(), 10) : null,
            gender: student.gender?.trim() || null,
            course: student.course?.trim() || null,
           // birthdate: student.birthdate?.trim() || null,
           birthdate: formatDate(student.birthdate?.trim()) ||null, // Format birthdate
            phone: student.phone?.trim() || null,
            email: student.email?.trim() || null,
            address: student.address?.trim() || null,
          }));

        setPreviewData(csvData);
      },
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("No file selected.");
      return;
    }
    if (!actionType) {
      setErrorMessage("Please choose an action before uploading.");
      return;
    }

    try {
      for (const student of previewData) {
        console.log("Uploading student:", student);
        await axios.post(API_URL, student);
      }
      toast.success("File uploaded successfully!");
      
      // Call the onUploadSuccess callback after successful upload
      if (onUploadSuccess) {
        await onUploadSuccess();
      }
      
      // Reset the form state
      setSelectedFile(null);
      setShowModal(false);
      setPreviewData([]);
      setActionType("");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload file.");
    }
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="csv-form">
          <div className="file-input-container">
            <input
              type="text"
              className="file-text"
              placeholder="No file chosen"
              value={selectedFile ? selectedFile.name : ""}
              readOnly
              onClick={openFilePicker}
            />
            <button className="csv-button" onClick={openFilePicker}>Choose File</button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="action-selection">
              <h3>Choose an Action:</h3>
              <label>
                <input 
                  type="radio" 
                  name="action" 
                  value="add" 
                  onChange={(e) => setActionType(e.target.value)} 
                />
                Add dataset
              </label>
              <label>
                <input 
                  type="radio" 
                  name="action" 
                  value="preview" 
                  onChange={(e) => setActionType(e.target.value)} 
                />
                Preview
              </label>
              {previewData.length > 0 && actionType === "preview" && (
                <div className="csv-preview">
                  <h4>CSV Preview:</h4>
                  <table>
                    <tbody>
                      {previewData.slice(0, 5).map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <div className="form-buttons">
            <button className="submit-button" onClick={handleUpload}>Upload File</button>
            <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
}

export default CSVUpload;