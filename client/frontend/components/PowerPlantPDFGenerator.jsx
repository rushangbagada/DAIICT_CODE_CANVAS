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
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filteredPlants, setFilteredPlants] = useState([]);
  
  const tableRef = useRef(null);
  const states = getStates();

  // State options for Select component
  const stateOptions = states.map(state => ({
    value: state,
    label: state
  }));

  // Filter and sort plants based on search term and sort config
  useEffect(() => {
    let filtered = powerPlants.filter(plant =>
      plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.fuelType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plant.operator.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'capacity') {
          const aNum = parseFloat(aValue.toString().replace(/[^\d.]/g, ''));
          const bNum = parseFloat(bValue.toString().replace(/[^\d.]/g, ''));
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredPlants(filtered);
  }, [powerPlants, searchTerm, sortConfig]);

  // Handle state selection
  const handleStateChange = (selectedOption) => {
    setSelectedState(selectedOption);
    setSearchTerm('');
    setSortConfig({ key: null, direction: 'asc' });
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

  // Handle sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
        <div className="header-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" className="factory-icon">
            <path d="M12 2L10 7H2V22H22V7H14L12 2ZM9 8H15V10H9V8ZM9 11H15V13H9V11ZM5 14H8V16H5V14ZM9 14H15V16H9V14ZM16 14H19V16H16V14ZM5 17H8V19H5V17ZM9 17H15V19H9V17ZM16 17H19V19H16V17Z"/>
          </svg>
          <svg viewBox="0 0 24 24" fill="currentColor" className="pdf-icon">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
        </div>
        <h1>Power Plants PDF Generator</h1>
        <p>Generate comprehensive reports for power plant data across Indian states</p>
        <div className="header-features">
          <span className="feature-badge"><span className="feature-icon">📊</span> Statistical Analysis</span>
          <span className="feature-badge"><span className="feature-icon">📧</span> Email Reports</span>
          <span className="feature-badge"><span className="feature-icon">📱</span> Mobile Responsive</span>
        </div>
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
          <div className="section-header">
            <h3>
              <svg viewBox="0 0 24 24" fill="currentColor" className="section-icon">
                <path d="M3 13H7V19H3V13ZM9 9H13V19H9V9ZM15 5H19V19H15V5Z"/>
              </svg>
              State Statistics
            </h3>
            <div className="state-badge">{selectedState.value}</div>
          </div>
          <div className="stats-grid">
            <div className="stat-card plants-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L10 7H2V22H22V7H14L12 2ZM9 8H15V10H9V8ZM9 11H15V13H9V11ZM5 14H8V16H5V14ZM9 14H15V16H9V14ZM16 14H19V16H16V14ZM5 17H8V19H5V17ZM9 17H15V19H9V17ZM16 17H19V19H16V17Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h4>Total Plants</h4>
                <span className="stat-number">{statistics.totalPlants}</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: `${Math.min((statistics.totalPlants / 50) * 100, 100)}%`}}></div>
                </div>
              </div>
            </div>
            <div className="stat-card capacity-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V7H9V11H15V9H21ZM7 17C7 17.55 7.45 18 8 18S9 17.55 9 17 8.55 16 8 16 7 16.45 7 17ZM15 17C15 17.55 15.45 18 16 18S17 17.55 17 17 16.55 16 16 16 15 16.45 15 17Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h4>Total Capacity</h4>
                <span className="stat-number">{statistics.totalCapacity}</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
            <div className="stat-card efficiency-card">
              <div className="stat-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.11 2 14 2.9 14 4C14 5.11 13.11 6 12 6C10.89 6 10 5.11 10 4C10 2.9 10.89 2 12 2ZM12 15C13.11 15 14 15.9 14 17C14 18.11 13.11 19 12 19C10.89 19 10 18.11 10 17C10 15.9 10.89 15 12 15ZM6 8C7.11 8 8 8.9 8 10C8 11.11 7.11 12 6 12C4.89 12 4 11.11 4 10C4 8.9 4.89 8 6 8ZM18 8C19.11 8 20 8.9 20 10C20 11.11 19.11 12 18 12C16.89 12 16 11.11 16 10C16 8.9 16.89 8 18 8ZM12 6.5C13.25 6.5 14.29 7.24 14.71 8.29L18 10L14.71 11.71C14.29 12.76 13.25 13.5 12 13.5C10.75 13.5 9.71 12.76 9.29 11.71L6 10L9.29 8.29C9.71 7.24 10.75 6.5 12 6.5Z"/>
                </svg>
              </div>
              <div className="stat-content">
                <h4>Average Efficiency</h4>
                <span className="stat-number">{statistics.avgEfficiency}</span>
                <div className="stat-progress">
                  <div className="progress-bar" style={{width: `${parseFloat(statistics.avgEfficiency)}%`}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Power Plants Table */}
      {powerPlants.length > 0 && (
        <div className="table-section" ref={tableRef}>
          <div className="table-header">
            <div className="table-title-section">
              <h3>
                <svg viewBox="0 0 24 24" fill="currentColor" className="section-icon">
                  <path d="M3,3V21H21V3M20,20H4V4H20V20Z"/>
                </svg>
                Power Plants in {selectedState.value}
              </h3>
              <span className="table-count">{filteredPlants.length} of {powerPlants.length} plants</span>
            </div>
            <div className="table-controls">
              <div className="search-container">
                <svg viewBox="0 0 24 24" fill="currentColor" className="search-icon">
                  <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search plants by name, location, fuel type, or operator..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="clear-search"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Sort Filter Buttons */}
          <div className="sort-filters">
            <div className="sort-filters-label">
              <svg viewBox="0 0 24 24" fill="currentColor" className="filter-icon">
                <path d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z"/>
              </svg>
              Sort by:
            </div>
            <div className="sort-buttons">
              <button
                className={`sort-btn ${sortConfig.key === 'name' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('name')}
              >
                <span>Plant Name</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'location' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('location')}
              >
                <span>Location</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'capacity' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('capacity')}
              >
                <span>Capacity</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'fuelType' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('fuelType')}
              >
                <span>Fuel Type</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'operator' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('operator')}
              >
                <span>Operator</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'commissionDate' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('commissionDate')}
              >
                <span>Date</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
              <button
                className={`sort-btn ${sortConfig.key === 'efficiency' ? `active sorted-${sortConfig.direction}` : ''}`}
                onClick={() => handleSort('efficiency')}
              >
                <span>Efficiency</span>
                <svg viewBox="0 0 24 24" fill="currentColor" className="sort-icon">
                  <path d="M18,21L14,17H17V7H14L18,3L22,7H19V17H22M2,19V17H12V19M2,13V11H9V13M2,7V5H6V7H2Z"/>
                </svg>
              </button>
            </div>
          </div>
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
                {filteredPlants.length > 0 ? filteredPlants.map((plant, index) => (
                  <tr key={plant.id} className="table-row" style={{animationDelay: `${index * 0.05}s`}}>
                    <td className="plant-name">{plant.name}</td>
                    <td>{plant.location}</td>
                    <td className="capacity">{plant.capacity}</td>
                    <td>
                      <span className={`fuel-badge fuel-${plant.fuelType.toLowerCase()}`}>
                        {plant.fuelType}
                      </span>
                    </td>
                    <td>{plant.operator}</td>
                    <td>{plant.commissionDate}</td>
                    <td className="efficiency">{plant.efficiency}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="no-results">
                      <div className="no-results-content">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="no-results-icon">
                          <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                        </svg>
                        <p>No plants match your search criteria</p>
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-small"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Search
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
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
