# VSM Analysis Tool

A comprehensive Value Stream Mapping (VSM) analysis application for optimizing Pull Request workflows at CitiusTech.

## 🚀 Features

- **File Upload**: Drag-and-drop or click to upload VSM files (.vsm or .json)
- **Data Validation**: Robust validation with helpful error messages
- **Workflow Visualization**: Interactive Mermaid.js flowcharts
- **Performance Analysis**: 3-month scenario analysis with 100 PRs/month
- **Capacity Modeling**: Configurable role capacity and utilization tracking
- **Bottleneck Analysis**: Identify top bottlenecks by wait time and utilization
- **PDF Export**: Download analysis reports and flowcharts as PDFs
- **Responsive Design**: Works on desktop and mobile devices

## 📁 Files Included

### Core Application Files
- **`index.html`** - Main HTML structure with CitiusTech branding
- **`styles.css`** - Complete CSS styling with corporate color scheme
- **`app.js`** - Full application logic and functionality

### Sample Data
- **`sample-pr-workflow.vsm`** - Example VSM file for testing (JSON format)
- **`sample-pr-workflow.xlsx.csv`** - Example Excel data in CSV format (open in Excel to convert)
- **`PR_Value_Stream_17_Steps.xlsx`** - Full Excel VSM file example

## 🛠️ VSM File Formats

The application supports multiple file formats:

### Excel Format (.xlsx, .xls)
Excel files should contain a worksheet with the following columns (case-insensitive):

| Column Header | Required | Description |
|---------------|----------|-------------|
| Step | ✅ | Step/process name |
| Input | ❌ | Input materials, data, or artifacts |
| Wait Time | ❌ | Non-value-added waiting time in minutes |
| Trigger | ❌ | What triggers/initiates this step |
| Processing Time | ❌ | Value-added processing time in minutes |
| Risks | ❌ | Identified risks or issues |
| Role | ✅ | Person/role performing the step |
| Tools | ❌ | Tools, systems, or software used |
| SOP | ❌ | Standard Operating Procedure reference |
| Dependency | ❌ | Step or process dependencies |
| Approval Time | ❌ | Time needed for approval in minutes |
| Value Stream Mapping/Cycle Time | ❌ | Total cycle time or VSM reference |
| Context & Reference | ❌ | Additional context or reference information |
| Rework Time | ❌ | Expected rework/iteration time in minutes |
| Quality Gate | ❌ | Quality criteria or gate definition |
| Output | ❌ | Output deliverables or artifacts |
| Change Notes | ❌ | Change history or notes |

**Notes:**
- First row is treated as headers
- Empty rows are automatically filtered out
- Missing optional columns default to 0 for numeric fields
- The Step column name is mapped to internal "name" field
- Multiple name variations are supported (e.g., "Step Name", "Step ID", "Name")

### Creating Excel Files
1. Open Excel and create a new workbook
2. Add the column headers in the first row as shown above
3. Fill in your VSM data starting from row 2
4. Save as .xlsx or .xls format
5. Alternatively, use the provided `sample-pr-workflow.xlsx.csv` file:
   - Open it in Excel
   - Save as .xlsx format
   - The CSV contains the same data as the JSON sample

### JSON/VSM Format (.vsm, .json)
JSON files should follow this structure:

```json
{
  "version": "1.2.0",
  "description": "Process description",
  "steps": [
    {
      "id": "unique_step_id",
      "name": "Step Name",
      "role": "Role Name",
      "type": "process|wait|decision|rework",
      "processTimeMins": 30,
      "waitTimeMins": 60,
      "reworkProbability": 0.1,
      "next": ["next_step_id"]
    }
  ]
}
```

### Required Fields per Step:
- `id` - Unique identifier
- `name` - Display name
- `role` - Person/role performing the step
- `type` - One of: process, wait, decision, rework

### Optional Fields:
- `processTimeMins` - Value-added processing time (default: 0)
- `waitTimeMins` - Non-value-added waiting time (default: 0)
- `reworkProbability` - Probability of rework (0-1, default: 0)
- `next` - Array of next step IDs for flowchart connections

## 🎯 How to Use

1. **Open `index.html`** in any modern web browser
2. **Upload VSM File**:
   - Drag and drop the file onto the upload area, or
   - Click the upload area and select a file
   - **Supported formats**: Excel (.xlsx, .xls) or JSON (.vsm, .json)
3. **Enter Version** (if prompted):
   - If the VSM file lacks version metadata, enter a version number
4. **Review Analysis**:
   - View the interactive flowchart
   - Review key metrics and capacity utilization
   - Analyze bottlenecks by wait time or utilization
5. **Adjust Capacity** (optional):
   - Modify hours per month or people per role
   - Click "Recalculate" to update analysis
6. **Export Results**:
   - Download flowchart as PDF
   - Download analysis summary as PDF

## 📊 Analysis Methodology

### Key Calculations

**Total PR Volume**: 100 PRs/month × 3 months = 300 PRs

**Per Step Analysis**:
- **Rework Factor**: `1 / (1 - reworkProbability)`
- **Total Processing Time**: `processTimeMins × PR_count × reworkFactor`
- **Total Waiting Time**: `waitTimeMins × PR_count × reworkFactor`

**Overall Metrics**:
- **Lead Time per PR**: Sum of all (processing + waiting) time across critical path
- **Value-Added Time per PR**: Sum of all processing time
- **Process Cycle Efficiency**: `(VA Time / Lead Time) × 100%`

**Capacity Analysis**:
- **Monthly Capacity**: `people_per_role × hours_per_month × 60`
- **Monthly Demand**: Sum of processing + waiting time per role
- **Utilization %**: `(Demand / Capacity) × 100`

### Assumptions
- 3-month analysis period
- Linear scaling with PR volume
- Independent rework probabilities
- 3 people per role (configurable)
- 160 hours per person per month (configurable)

## 🎨 Design System

### CitiusTech Brand Colors
- **Primary**: `#0F3D81` (Deep blue)
- **Accent**: `#211CE8` (Bright blue)
- **Neutral**: `#CED4DB` (Light gray)
- **Background**: `#F7F9FC` (Off-white)
- **Text**: `#102A43` (Dark blue-gray)

### Typography
- **Font Family**: System font stack (sans-serif)
- **Scale**: Responsive sizing from 0.75rem to 3rem
- **Weights**: 400 (regular), 600 (semibold), 700 (bold)

## 🔧 Technical Implementation

### Libraries Used
- **Mermaid.js**: Flowchart generation and rendering
- **jsPDF**: PDF document creation
- **html2canvas**: HTML element to canvas conversion
- **SheetJS (XLSX)**: Excel file parsing and processing

### Browser Support
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Architecture
- **Single HTML File**: No build process required
- **Vanilla JavaScript**: No frameworks or dependencies
- **Modular Functions**: Clean separation of concerns
- **Error Handling**: Comprehensive validation and user feedback

## 🚀 Deployment

1. Copy all files to a web server
2. Ensure CDN access for external libraries
3. Open `index.html` in a browser
4. Application runs entirely client-side

## 📈 Future Enhancements

- Multiple workflow comparison
- Historical data integration
- Advanced bottleneck detection algorithms
- Custom PDF templates
- Real-time collaboration features
- Integration with project management tools

## 📞 Support

For questions or issues:
- **Creator**: Gaurav Chonkar
- **Version**: As displayed in application footer
- **Documentation**: This README file

---

**CitiusTech Engineering Leadership Tool**
*Optimizing PR workflows through data-driven VSM analysis*