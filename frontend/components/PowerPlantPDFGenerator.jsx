import React, { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getStates, getPowerPlantsByState, getStateStatistics } from '../src/services/powerPlantService';
import { useAuth } from '../src/AuthContext';
import './css/PowerPlantPDFGenerator.css';
import toast, { Toaster } from 'react-hot-toast';

const PowerPlantPDFGenerator = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedState, setSelectedState] = useState(null);
  const [powerPlants, setPowerPlants] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [emailData, setEmailData] = useState({
    message: ''
  });
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [generatedPDFBlob, setGeneratedPDFBlob] = useState(null);
  
  const tableRef = useRef(null);
  const states = getStates();

  // State options for Select component
  const stateOptions = states.map(state => ({
    value: state,
    label: state
  }));

  // Handle state selection
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    if (selectedOption) {
      const plants = getPowerPlantsByState(selectedOption.value);
      const stats = getStateStatistics(selectedOption.value);
      setPowerPlants(plants);
      setStatistics(stats);
    } else {
      setPowerPlants([]);
      setStatistics(null);
    }
  };

  // Generate PDF from the table
  const generatePDF = async () => {
    if (!selectedState || powerPlants.length === 0) {
      alert('Please select a state first!');
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Create a new jsPDF instance
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(20);
      pdf.setTextColor(0, 100, 0);
      pdf.text('Power Plants Report', pageWidth / 2, 20, { align: 'center' });
      
      // State name
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`State: ${selectedState.value}`, 20, 35);
      
      // Statistics
      if (statistics) {
        pdf.setFontSize(12);
        pdf.text(`Total Plants: ${statistics.totalPlants}`, 20, 50);
        pdf.text(`Total Capacity: ${statistics.totalCapacity}`, 20, 60);
        pdf.text(`Average Efficiency: ${statistics.avgEfficiency}`, 20, 70);
      }
      
      // Table header
      const startY = 85;
      const rowHeight = 8;
      const colWidths = [60, 40, 25, 25, 30, 15];
      let currentY = startY;
      
      // Table headers
      pdf.setFillColor(200, 200, 200);
      pdf.rect(20, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
      
      pdf.setFontSize(10);
      pdf.setTextColor(0, 0, 0);
      let currentX = 20;
      const headers = ['Plant Name', 'Location', 'Capacity', 'Fuel Type', 'Operator', 'Efficiency'];
      
      headers.forEach((header, index) => {
        pdf.text(header, currentX + 2, currentY + 5);
        currentX += colWidths[index];
      });
      
      currentY += rowHeight;
      
      // Table rows
      powerPlants.forEach((plant, index) => {
        // Check if we need a new page
        if (currentY + rowHeight > pageHeight - 20) {
          pdf.addPage();
          currentY = 20;
        }
        
        // Alternate row coloring
        if (index % 2 === 0) {
          pdf.setFillColor(245, 245, 245);
          pdf.rect(20, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, 'F');
        }
        
        currentX = 20;
        const rowData = [
          plant.name,
          plant.location,
          plant.capacity,
          plant.fuelType,
          plant.operator,
          plant.efficiency
        ];
        
        rowData.forEach((data, colIndex) => {
          const text = data.length > 25 ? data.substring(0, 22) + '...' : data;
          pdf.text(text, currentX + 2, currentY + 5);
          currentX += colWidths[colIndex];
        });
        
        currentY += rowHeight;
      });
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, pageHeight - 10);
      pdf.text('Green Hydrogen Initiative - Power Plants Database', pageWidth / 2, pageHeight - 10, { align: 'center' });
      
      // Convert to blob for email attachment
      const pdfBlob = pdf.output('blob');
      setGeneratedPDFBlob(pdfBlob);
      
      // Download the PDF
      pdf.save(`${selectedState.value}_power_plants_report.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Handle email form submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      toast.error('Please login to send emails!');
      return;
    }
    
    if (!generatedPDFBlob) {
      toast.error('Please generate a PDF first!');
      return;
    }
    
    setIsSendingEmail(true);
    
    try {
      // Create FormData to send PDF as attachment
      const formData = new FormData();
      formData.append('recipientEmail', user.email);
      formData.append('recipientName', user.name);
      formData.append('message', emailData.message || `Please find attached the power plants report for ${selectedState.value}.`);
      formData.append('stateName', selectedState.value);
      formData.append('totalPlants', statistics?.totalPlants || 0);
      formData.append('totalCapacity', statistics?.totalCapacity || '0 MW');
      formData.append('avgEfficiency', statistics?.avgEfficiency || '0%');
      
      // Add PDF file
      const pdfFile = new File([generatedPDFBlob], `${selectedState.value}_power_plants_report.pdf`, {
        type: 'application/pdf'
      });
      formData.append('pdfFile', pdfFile);
      
      // Send to backend endpoint
      const response = await fetch('/api/email/send-pdf-report', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        toast.error(result.message || 'Failed to send email');
        } else {
          toast.success(`Email sent successfully to ${user.email}!`);
          setShowEmailModal(false);
          setEmailData({ message: '' });
        }
      
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email. Please try again.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="pdf-generator-container">
      <div className="pdf-generator-header">
        <h1>Power Plants PDF Generator</h1>
        <p>Select a state to view power plant data and generate PDF reports</p>
      </div>

      {/* State Selection */}
      <div className="state-selector">
        <label htmlFor="state-select">Select State:</label>
        <Select
          id="state-select"
          value={selectedState}
          onChange={handleStateChange}
          options={stateOptions}
          placeholder="Choose a state..."
          isClearable
          className="state-select"
          classNamePrefix="select"
        />
      </div>

      {/* Statistics Section */}
      {statistics && (
        <div className="statistics-section">
          <h3>State Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Plants</h4>
              <span>{statistics.totalPlants}</span>
            </div>
            <div className="stat-card">
              <h4>Total Capacity</h4>
              <span>{statistics.totalCapacity}</span>
            </div>
            <div className="stat-card">
              <h4>Average Efficiency</h4>
              <span>{statistics.avgEfficiency}</span>
            </div>
          </div>
        </div>
      )}

      {/* Power Plants Table */}
      {powerPlants.length > 0 && (
        <div className="table-section" ref={tableRef}>
          <h3>Power Plants in {selectedState.value}</h3>
          <div className="table-container">
            <table className="power-plants-table">
              <thead>
                <tr>
                  <th>Plant Name</th>
                  <th>Location</th>
                  <th>Capacity</th>
                  <th>Fuel Type</th>
                  <th>Operator</th>
                  <th>Commission Date</th>
                  <th>Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {powerPlants.map((plant) => (
                  <tr key={plant.id}>
                    <td>{plant.name}</td>
                    <td>{plant.location}</td>
                    <td>{plant.capacity}</td>
                    <td>
                      <span className={`fuel-badge fuel-${plant.fuelType.toLowerCase()}`}>
                        {plant.fuelType}
                      </span>
                    </td>
                    <td>{plant.operator}</td>
                    <td>{plant.commissionDate}</td>
                    <td>{plant.efficiency}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {powerPlants.length > 0 && (
        <div className="action-buttons">
          <button 
            onClick={generatePDF}
            disabled={isGeneratingPDF}
            className="btn btn-primary"
          >
            {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
          </button>
          
          <button 
            onClick={() => setShowEmailModal(true)}
            disabled={!generatedPDFBlob || !isAuthenticated()}
            className="btn btn-secondary"
            title={!isAuthenticated() ? 'Please login to send emails' : 'Send PDF to your registered email'}
          >
            {isAuthenticated() ? `Send to ${user?.email}` : 'Login to Send Email'}
          </button>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Send PDF via Email</h3>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleEmailSubmit} className="email-form">
              <div className="form-group">
                <label htmlFor="recipientInfo">Sending to:</label>
                <div className="recipient-info">
                  <div className="recipient-details">
                    <strong>{user?.name}</strong>
                    <span>{user?.email}</span>
                    <small>{user?.department} • {user?.year}</small>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  value={emailData.message}
                  onChange={(e) => setEmailData({...emailData, message: e.target.value})}
                  placeholder="Add a custom message (optional)"
                  rows="4"
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowEmailModal(false)}
                  className="btn btn-cancel"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSendingEmail}
                  className="btn btn-primary"
                >
                  {isSendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {selectedState && powerPlants.length === 0 && (
        <div className="no-data-message">
          <p>No power plant data available for {selectedState.value}</p>
        </div>
      )}
      
      <Toaster position="top-right" />
    </div>
  );
};

export default PowerPlantPDFGenerator;
