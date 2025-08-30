# Power Plant PDF Generator

A comprehensive React component for generating PDF reports of power plant data by state, with email functionality.

## Features

- **State Selection**: Dropdown to select any Indian state
- **Data Display**: Tabular view of power plants with comprehensive information
- **Statistics**: Real-time statistics showing total plants, capacity, and efficiency
- **PDF Generation**: High-quality PDF reports with professional formatting
- **Email Integration**: Send generated PDFs via email using EmailJS
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with smooth animations

## Usage

### Accessing the PDF Generator

Navigate to `/pdf-generator` in your application to access the PDF generator page.

### Basic Workflow

1. **Select a State**: Use the dropdown to choose from available Indian states
2. **View Data**: The page will display:
   - State statistics (total plants, capacity, average efficiency)
   - Detailed table of all power plants in the selected state
3. **Generate PDF**: Click "Generate PDF" to create and download a formatted report
4. **Send via Email**: Click "Send via Email" to open the email modal and send the PDF to recipients

## Data Fields

Each power plant entry includes:
- **Plant Name**: Official name of the power plant
- **Location**: City and state location
- **Capacity**: Power generation capacity in MW
- **Fuel Type**: Energy source (Coal, Nuclear, Hydro, Solar, Wind, etc.)
- **Operator**: Company or organization operating the plant
- **Commission Date**: Year the plant started operations
- **Efficiency**: Plant efficiency percentage

## PDF Report Features

- Professional header with report title
- State name and selection date
- Statistical summary
- Formatted table with all power plant data
- Fuel type color coding
- Page numbering and footer information
- Optimized for printing and sharing

## Email Configuration

The email functionality uses your existing backend email service that's already configured for OTP. No additional setup is required!

### How It Works

1. **Backend Integration**: Uses the same Nodemailer configuration from your existing OTP system
2. **PDF Attachment**: Sends the generated PDF as an email attachment
3. **Professional Templates**: Beautiful HTML email templates with report summaries
4. **File Validation**: Validates PDF files and email addresses before sending

### Email Features

- **Rich HTML Templates**: Professional email design with report statistics
- **PDF Attachments**: Secure PDF delivery up to 10MB
- **Custom Messages**: Personalized messages for recipients
- **Report Summary**: Inline statistics in the email
- **Error Handling**: Comprehensive error messages and validation

## States Available

Current data includes power plants from:
- Gujarat
- Maharashtra
- Rajasthan
- Tamil Nadu
- Uttar Pradesh

## Technical Details

### Dependencies

- `react` - Core React library
- `react-select` - Enhanced dropdown component
- `jspdf` - PDF generation
- `html2canvas` - HTML to canvas conversion
- `emailjs-com` - Email service integration

### File Structure

```
components/
├── PowerPlantPDFGenerator.jsx    # Main component
└── css/
    └── PowerPlantPDFGenerator.css # Styling

src/
├── services/
│   └── powerPlantService.js      # Data service
└── config/
    └── emailConfig.js            # Email configuration
```

### Browser Compatibility

- Modern browsers supporting ES6+
- PDF generation works in all major browsers
- Email functionality requires internet connection

## Customization

### Adding New States

1. Edit `src/services/powerPlantService.js`
2. Add new state data to the `powerPlantsData` object
3. Follow the existing data structure

### Modifying PDF Layout

1. Edit the `generatePDF` function in `PowerPlantPDFGenerator.jsx`
2. Customize colors, fonts, and layout as needed
3. Adjust table column widths and positioning

### Styling Changes

1. Edit `components/css/PowerPlantPDFGenerator.css`
2. Modify colors, spacing, and responsive breakpoints
3. Update animations and transitions

## Troubleshooting

### PDF Generation Issues
- Ensure all required dependencies are installed
- Check browser console for JavaScript errors
- Verify data is loaded before generating PDF

### Email Not Working
- Check EmailJS configuration in `emailConfig.js`
- Verify EmailJS service is active
- Check browser network tab for API errors
- Ensure recipient email is valid

### Styling Issues
- Check CSS file is properly imported
- Verify Tailwind classes are compiled
- Check browser developer tools for styling conflicts

## Performance Considerations

- PDF generation is client-side and may be slow for large datasets
- Email attachments are limited by EmailJS plan limits
- Consider implementing pagination for very large state data

## Security Notes

- EmailJS keys are exposed in client-side code
- Consider using environment variables for production
- Implement rate limiting for email functionality
- Validate user inputs before processing

## Future Enhancements

Potential improvements:
- Export to Excel format
- Multiple state selection
- Data filtering and sorting
- Chart generation in PDFs
- Backend integration for real-time data
- User authentication for personalized reports
- Advanced email templates with HTML formatting

## Support

For issues and questions:
1. Check the browser console for errors
2. Verify all dependencies are installed
3. Ensure EmailJS configuration is correct
4. Review the component props and data structure
