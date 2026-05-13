/**
 * VSM Analysis Tool - Application Logic
 * CitiusTech Pull Request Workflow Optimization
 */

// Global state
let vsmData = null;
let analysisResults = null;
let currentFileName = '';
let fileVersion = '';
let uploadTimestamp = '';

// DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const versionSection = document.getElementById('versionSection');
const versionInput = document.getElementById('versionInput');
const resultsContainer = document.getElementById('resultsContainer');
const statusContainer = document.getElementById('statusContainer');
const fileInfo = document.getElementById('fileInfo');
const fileMetadata = document.getElementById('fileMetadata');

// Configuration
const MONTHLY_PR_VOLUME = 100;
const TOTAL_MONTHS = 3;
const TOTAL_PR_VOLUME = MONTHLY_PR_VOLUME * TOTAL_MONTHS;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    showStatus('Ready to upload VSM file', 'success');
});

/**
 * Initialize event listeners
 */
function initializeEventListeners() {
    // File upload events
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleFileDrop);
    fileInput.addEventListener('change', handleFileSelect);

    // Version input
    versionInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setVersionAndProceed();
        }
    });
}

/**
 * File upload event handlers
 */
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
}

function handleFileDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

/**
 * Process uploaded file
 */
function processFile(file) {
    currentFileName = file.name;
    uploadTimestamp = new Date().toLocaleString();

    showStatus('Processing file...', 'success');

    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        // Handle Excel files
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assume the first worksheet contains the VSM data
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                // Convert Excel data to VSM format
                const vsmData = convertExcelToVSM(jsonData, worksheetName);
                validateAndProcessVSM(vsmData);
            } catch (error) {
                showStatus('Error parsing Excel file: ' + error.message, 'error');
            }
        };
        reader.onerror = function() {
            showStatus('Error reading Excel file', 'error');
        };
        reader.readAsArrayBuffer(file);
    } else {
        // Handle JSON/VSM files (existing logic)
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const content = e.target.result;
                const parsedData = JSON.parse(content);
                validateAndProcessVSM(parsedData);
            } catch (error) {
                showStatus('Error parsing JSON file: ' + error.message, 'error');
            }
        };
        reader.onerror = function() {
            showStatus('Error reading file', 'error');
        };
        reader.readAsText(file);
    }
}

/**
 * Convert Excel data to VSM format
 */
function convertExcelToVSM(excelData, worksheetName) {
    // Remove empty rows and header row
    const dataRows = excelData.filter(row =>
        row && row.length > 0 && row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );

    if (dataRows.length < 2) {
        throw new Error('Excel file must contain at least a header row and one data row');
    }

    // Assume first row is headers
    const headers = dataRows[0].map(header => header ? header.toString().toLowerCase().trim() : '');
    const rows = dataRows.slice(1);

    // Map common header variations to standard field names
    const headerMappings = {
        'step': 'name',
        'step name': 'name',
        'stepname': 'name',
        'name': 'name',
        'step id': 'id',
        'stepid': 'id',
        'id': 'id',
        'input': 'input',
        'inputs': 'input',
        'wait time': 'waitTimeMins',
        'waittime': 'waitTimeMins',
        'wait time (mins)': 'waitTimeMins',
        'wait_time_mins': 'waitTimeMins',
        'trigger': 'trigger',
        'triggers': 'trigger',
        'processing time': 'processTimeMins',
        'processtime': 'processTimeMins',
        'process time (mins)': 'processTimeMins',
        'process_time_mins': 'processTimeMins',
        'processing time (mins)': 'processTimeMins',
        'risks': 'risks',
        'risk': 'risks',
        'role': 'role',
        'roles': 'role',
        'tools': 'tools',
        'tool': 'tools',
        'sop': 'sop',
        'standard operating procedure': 'sop',
        'dependency': 'dependency',
        'dependencies': 'dependency',
        'approval time': 'approvalTimeMins',
        'approvaltime': 'approvalTimeMins',
        'approval time (mins)': 'approvalTimeMins',
        'approval_time_mins': 'approvalTimeMins',
        'value stream mapping': 'vsm',
        'value stream mapping/cycle time': 'vsm',
        'cycle time': 'vsm',
        'context': 'context',
        'context & reference': 'context',
        'context and reference': 'context',
        'reference': 'context',
        'rework time': 'reworkTimeMins',
        'reworktime': 'reworkTimeMins',
        'rework time (mins)': 'reworkTimeMins',
        'rework_time_mins': 'reworkTimeMins',
        'rework probability': 'reworkProbability',
        'reworkprobability': 'reworkProbability',
        'rework_probability': 'reworkProbability',
        'rework rate': 'reworkProbability',
        'reworkrate': 'reworkProbability',
        'quality gate': 'qualityGate',
        'qualitygate': 'qualityGate',
        'quality_gate': 'qualityGate',
        'output': 'output',
        'outputs': 'output',
        'change notes': 'changeNotes',
        'changenotes': 'changeNotes',
        'change_notes': 'changeNotes',
        'notes': 'changeNotes',
        'next steps': 'next',
        'nextsteps': 'next',
        'next': 'next',
        'transitions': 'next',
        'next step': 'next',
        'nextstep': 'next',
        'type': 'type'
    };

    // Create field mapping
    const fieldMapping = {};
    headers.forEach((header, index) => {
        const mappedField = headerMappings[header];
        if (mappedField) {
            fieldMapping[mappedField] = index;
        }
    });

    // Validate required fields (only Step and Role are required)
    const requiredFields = ['name', 'role'];
    const missingFields = requiredFields.filter(field => !(field in fieldMapping));

    if (missingFields.length > 0) {
        throw new Error(`Excel file missing required columns: ${missingFields.join(', ')}. ` +
                       `Found columns: ${headers.join(', ')}`);
    }

    // Convert rows to VSM steps
    const steps = rows.map((row, index) => {
        const stepName = getCellValue(row, fieldMapping.name);
        
        const step = {
            id: stepName || `step_${index + 1}`,
            name: stepName,
            role: getCellValue(row, fieldMapping.role),
            type: getCellValue(row, fieldMapping.type) || 'process'
        };

        // Add optional text fields
        if (fieldMapping.input !== undefined) {
            const input = getCellValue(row, fieldMapping.input);
            if (input) step.input = input;
        }

        if (fieldMapping.trigger !== undefined) {
            const trigger = getCellValue(row, fieldMapping.trigger);
            if (trigger) step.trigger = trigger;
        }

        if (fieldMapping.risks !== undefined) {
            const risks = getCellValue(row, fieldMapping.risks);
            if (risks) step.risks = risks;
        }

        if (fieldMapping.tools !== undefined) {
            const tools = getCellValue(row, fieldMapping.tools);
            if (tools) step.tools = tools;
        }

        if (fieldMapping.sop !== undefined) {
            const sop = getCellValue(row, fieldMapping.sop);
            if (sop) step.sop = sop;
        }

        if (fieldMapping.dependency !== undefined) {
            const dependency = getCellValue(row, fieldMapping.dependency);
            if (dependency) step.dependency = dependency;
        }

        if (fieldMapping.context !== undefined) {
            const context = getCellValue(row, fieldMapping.context);
            if (context) step.context = context;
        }

        if (fieldMapping.qualityGate !== undefined) {
            const qualityGate = getCellValue(row, fieldMapping.qualityGate);
            if (qualityGate) step.qualityGate = qualityGate;
        }

        if (fieldMapping.output !== undefined) {
            const output = getCellValue(row, fieldMapping.output);
            if (output) step.output = output;
        }

        if (fieldMapping.changeNotes !== undefined) {
            const changeNotes = getCellValue(row, fieldMapping.changeNotes);
            if (changeNotes) step.changeNotes = changeNotes;
        }

        if (fieldMapping.vsm !== undefined) {
            const vsm = getCellValue(row, fieldMapping.vsm);
            if (vsm) step.vsm = vsm;
        }

        // Add optional numeric fields
        if (fieldMapping.processTimeMins !== undefined) {
            const processTime = parseFloat(getCellValue(row, fieldMapping.processTimeMins));
            if (!isNaN(processTime)) step.processTimeMins = processTime;
        }

        if (fieldMapping.waitTimeMins !== undefined) {
            const waitTime = parseFloat(getCellValue(row, fieldMapping.waitTimeMins));
            if (!isNaN(waitTime)) step.waitTimeMins = waitTime;
        }

        if (fieldMapping.approvalTimeMins !== undefined) {
            const approvalTime = parseFloat(getCellValue(row, fieldMapping.approvalTimeMins));
            if (!isNaN(approvalTime)) step.approvalTimeMins = approvalTime;
        }

        if (fieldMapping.reworkTimeMins !== undefined) {
            const reworkTime = parseFloat(getCellValue(row, fieldMapping.reworkTimeMins));
            if (!isNaN(reworkTime)) step.reworkTimeMins = reworkTime;
        }

        if (fieldMapping.reworkProbability !== undefined) {
            const reworkProb = parseFloat(getCellValue(row, fieldMapping.reworkProbability));
            if (!isNaN(reworkProb)) step.reworkProbability = reworkProb;
        }

        // Handle next steps (can be comma-separated string or array)
        if (fieldMapping.next !== undefined) {
            const nextValue = getCellValue(row, fieldMapping.next);
            if (nextValue) {
                if (Array.isArray(nextValue)) {
                    step.next = nextValue;
                } else if (typeof nextValue === 'string') {
                    step.next = nextValue.split(',').map(s => s.trim()).filter(s => s);
                }
            }
        }

        // Set defaults for missing fields
        if (step.processTimeMins === undefined) step.processTimeMins = 0;
        if (step.waitTimeMins === undefined) step.waitTimeMins = 0;
        if (step.approvalTimeMins === undefined) step.approvalTimeMins = 0;
        if (step.reworkTimeMins === undefined) step.reworkTimeMins = 0;
        if (step.reworkProbability === undefined) step.reworkProbability = 0;
        if (!step.next) step.next = [];

        return step;
    });

    // Create VSM data structure
    const vsmData = {
        version: '1.0.0', // Default version
        description: `VSM data imported from Excel worksheet: ${worksheetName}`,
        createdBy: 'Excel Import',
        createdDate: new Date().toISOString().split('T')[0],
        steps: steps,
        metadata: {
            source: 'Excel Import',
            worksheet: worksheetName,
            importedAt: new Date().toISOString(),
            originalHeaders: headers
        }
    };

    return vsmData;
}

/**
 * Get cell value safely
 */
function getCellValue(row, columnIndex) {
    if (!row || columnIndex === undefined || columnIndex >= row.length) {
        return '';
    }
    const value = row[columnIndex];
    return value !== null && value !== undefined ? value : '';
}

/**
 * Validate and process VSM data
 */
function validateAndProcessVSM(data) {
    try {
        // Validate required fields
        if (!data.steps || !Array.isArray(data.steps)) {
            throw new Error('VSM file must contain a "steps" array');
        }

        if (data.steps.length === 0) {
            throw new Error('VSM file must contain at least one step');
        }

        // Validate each step
        data.steps.forEach((step, index) => {
            validateStep(step, index);
        });

        // Check for version metadata
        if (!data.version) {
            // Show version input section
            versionSection.style.display = 'block';
            resultsContainer.style.display = 'none';
            vsmData = data; // Store temporarily
            return;
        }

        // Process the VSM data
        processVSMData(data);

    } catch (error) {
        showStatus('Validation error: ' + error.message, 'error');
    }
}

/**
 * Validate individual step
 */
function validateStep(step, index) {
    const requiredFields = ['id', 'name', 'role', 'type'];
    const missingFields = requiredFields.filter(field => !step[field]);

    if (missingFields.length > 0) {
        throw new Error(`Step ${index + 1} (${step.name || 'unnamed'}) missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate step type
    const validTypes = ['process', 'wait', 'decision', 'rework'];
    if (!validTypes.includes(step.type)) {
        throw new Error(`Step ${index + 1} has invalid type "${step.type}". Must be one of: ${validTypes.join(', ')}`);
    }

    // Validate numeric fields
    const numericFields = ['processTimeMins', 'waitTimeMins'];
    numericFields.forEach(field => {
        if (step[field] !== undefined && (typeof step[field] !== 'number' || step[field] < 0)) {
            throw new Error(`Step ${index + 1} has invalid ${field}: must be a non-negative number`);
        }
    });

    // Validate rework probability
    if (step.reworkProbability !== undefined) {
        if (typeof step.reworkProbability !== 'number' || step.reworkProbability < 0 || step.reworkProbability > 1) {
            throw new Error(`Step ${index + 1} has invalid reworkProbability: must be between 0 and 1`);
        }
    }

    // Set defaults for missing numeric fields
    if (step.processTimeMins === undefined) step.processTimeMins = 0;
    if (step.waitTimeMins === undefined) step.waitTimeMins = 0;
    if (step.reworkProbability === undefined) step.reworkProbability = 0;
}

/**
 * Set version and proceed with processing
 */
function setVersionAndProceed() {
    fileVersion = versionInput.value.trim() || 'v1.0.0';
    versionSection.style.display = 'none';
    processVSMData(vsmData);
    vsmData = null;
}

/**
 * Process VSM data and generate analysis
 */
function processVSMData(data) {
    fileVersion = data.version || fileVersion;
    vsmData = data;

    // Update footer
    updateFooter();

    // Perform analysis
    analysisResults = performAnalysis(data);

    // Render results
    renderFlowchart(data);
    renderAnalysisResults(analysisResults);

    // Show results
    resultsContainer.style.display = 'block';
    showStatus('Analysis complete!', 'success');
}

/**
 * Update footer with file information
 */
function updateFooter() {
    fileInfo.textContent = `Version: ${fileVersion} | Creator: Gaurav Chonkar`;
    fileMetadata.textContent = `${currentFileName} | Uploaded: ${uploadTimestamp}`;
}

/**
 * Perform VSM analysis calculations
 */
function performAnalysis(data) {
    const results = {
        totalPRs: TOTAL_PR_VOLUME,
        steps: [],
        roles: {},
        overall: {
            totalLeadTime: 0,
            totalValueAddedTime: 0,
            processCycleEfficiency: 0
        }
    };

    // Get capacity settings
    const hoursPerMonth = parseFloat(document.getElementById('hoursPerMonth').value) || 160;
    const peoplePerRole = parseInt(document.getElementById('peoplePerRole').value) || 3;
    const monthlyCapacityMinutes = peoplePerRole * hoursPerMonth * 60;

    // Analyze each step
    data.steps.forEach(step => {
        const reworkFactor = 1 / (1 - step.reworkProbability); // Expected rework iterations
        const stepPRs = TOTAL_PR_VOLUME * reworkFactor;

        const stepAnalysis = {
            id: step.id,
            name: step.name,
            role: step.role,
            type: step.type,
            processTimeMins: step.processTimeMins,
            waitTimeMins: step.waitTimeMins,
            reworkProbability: step.reworkProbability,
            reworkFactor: reworkFactor,
            totalProcessingTime: step.processTimeMins * stepPRs,
            totalWaitingTime: step.waitTimeMins * stepPRs,
            leadTimeContribution: (step.processTimeMins + step.waitTimeMins) * stepPRs
        };

        results.steps.push(stepAnalysis);

        // Aggregate by role
        if (!results.roles[step.role]) {
            results.roles[step.role] = {
                name: step.role,
                totalProcessingTime: 0,
                totalWaitingTime: 0,
                steps: [],
                capacityMinutes: monthlyCapacityMinutes,
                utilization: 0
            };
        }

        results.roles[step.role].totalProcessingTime += stepAnalysis.totalProcessingTime;
        results.roles[step.role].totalWaitingTime += stepAnalysis.totalWaitingTime;
        results.roles[step.role].steps.push(stepAnalysis);
    });

    // Calculate role utilization
    Object.values(results.roles).forEach(role => {
        const totalDemandMinutes = role.totalProcessingTime + role.totalWaitingTime;
        role.utilization = (totalDemandMinutes / role.capacityMinutes) * 100;
        role.demandMinutes = totalDemandMinutes;
    });

    // Calculate overall metrics
    results.overall.totalLeadTime = results.steps.reduce((sum, step) => sum + step.leadTimeContribution, 0) / TOTAL_PR_VOLUME;
    results.overall.totalValueAddedTime = results.steps.reduce((sum, step) => sum + (step.processTimeMins * TOTAL_PR_VOLUME * step.reworkFactor), 0) / TOTAL_PR_VOLUME;
    results.overall.processCycleEfficiency = (results.overall.totalValueAddedTime / results.overall.totalLeadTime) * 100;

    return results;
}

/**
 * Render custom SVG flowchart
 */
function renderFlowchart(data) {
    const svg = document.getElementById('processFlowchart');
    svg.innerHTML = '';

    // Define arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '10');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3, 0 6');
    polygon.setAttribute('fill', '#666');
    
    marker.appendChild(polygon);
    defs.appendChild(marker);
    svg.appendChild(defs);

    // Node dimensions
    const nodeWidth = 90;
    const nodeHeight = 65;
    const nodeSpacingX = 140;
    const nodeSpacingY = 150;
    const startX = 60;  // Increased from 20 for left padding
    const startY = 60;  // Increased from 20 for top padding

    // Calculate SVG dimensions
    const cols = Math.ceil(Math.sqrt(data.steps.length));
    const rows = Math.ceil(data.steps.length / cols);
    const svgWidth = cols * nodeSpacingX + 80;
    const svgHeight = rows * nodeSpacingY + 100;

    svg.setAttribute('width', svgWidth);
    svg.setAttribute('height', svgHeight);
    svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);

    // Create nodes and connections
    data.steps.forEach((step, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        const x = startX + col * nodeSpacingX;
        const y = startY + row * nodeSpacingY;

        // Classify step type
        const stepType = classifyStepType(step);
        
        // Get color based on type
        let fillColor, strokeColor;
        if (stepType === 'VA') {
            fillColor = '#10B981';
            strokeColor = '#059669';
        } else if (stepType === 'ENVA') {
            fillColor = '#F59E0B';
            strokeColor = '#D97706';
        } else {
            fillColor = '#EF4444';
            strokeColor = '#DC2626';
        }

        // Create group for node
        const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        nodeGroup.setAttribute('class', 'process-node');
        nodeGroup.setAttribute('data-step', index);

        // Create rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', 'process-node-rect');
        rect.setAttribute('x', x - nodeWidth / 2);
        rect.setAttribute('y', y - nodeHeight / 2);
        rect.setAttribute('width', nodeWidth);
        rect.setAttribute('height', nodeHeight);
        rect.setAttribute('fill', fillColor);
        rect.setAttribute('stroke', strokeColor);
        nodeGroup.appendChild(rect);

        // Create text for step name with wrapping
        const displayName = step.name;
        const words = displayName.split(' ');
        const maxCharsPerLine = 10;
        let lines = [];
        let currentLine = '';

        words.forEach(word => {
            if ((currentLine + ' ' + word).length > maxCharsPerLine) {
                if (currentLine) lines.push(currentLine.trim());
                currentLine = word;
            } else {
                currentLine = currentLine ? currentLine + ' ' + word : word;
            }
        });
        if (currentLine) lines.push(currentLine.trim());

        // Create text elements for each line
        const lineHeight = 10;
        const totalTextHeight = (lines.length - 1) * lineHeight;
        
        lines.forEach((line, lineIndex) => {
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('class', 'process-node-text');
            text.setAttribute('x', x);
            text.setAttribute('y', y - totalTextHeight / 2 + lineIndex * lineHeight);
            text.setAttribute('text-anchor', 'middle');
            
            // Truncate if still too long
            const displayLine = line.length > 12 ? line.substring(0, 12) + '.' : line;
            text.textContent = displayLine;
            nodeGroup.appendChild(text);
        });

        // Create text for time
        if (step.processTimeMins > 0) {
            const timeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            timeText.setAttribute('class', 'process-node-time');
            timeText.setAttribute('x', x);
            timeText.setAttribute('y', y + 15);
            timeText.setAttribute('text-anchor', 'middle');
            timeText.textContent = `${step.processTimeMins}m`;
            nodeGroup.appendChild(timeText);
        }

        svg.appendChild(nodeGroup);

        // Draw arrow to next node
        if (index < data.steps.length - 1) {
            const nextRow = Math.floor((index + 1) / cols);
            const nextCol = (index + 1) % cols;
            const nextX = startX + nextCol * nodeSpacingX;
            const nextY = startY + nextRow * nodeSpacingY;

            // Calculate arrow start and end points
            const x1 = x + (nextX > x ? nodeWidth / 2 : -nodeWidth / 2);
            const y1 = y + (nextY > y ? nodeHeight / 2 : -nodeHeight / 2);
            const x2 = nextX - (nextX > x ? nodeWidth / 2 : -nodeWidth / 2);
            const y2 = nextY - (nextY > y ? nodeHeight / 2 : -nodeHeight / 2);

            // Create arrow path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', 'process-arrow');
            
            // Create curve path
            const controlX = (x1 + x2) / 2;
            const controlY = (y1 + y2) / 2;
            
            const pathData = `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
            path.setAttribute('d', pathData);
            
            svg.appendChild(path);

            // Add arrow label if wait time exists
            if (step.totalWaitingTime > 0) {
                const labelX = (x1 + x2) / 2 + 10;
                const labelY = (y1 + y2) / 2 - 5;
                
                const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                labelText.setAttribute('class', 'process-arrow-label');
                labelText.setAttribute('x', labelX);
                labelText.setAttribute('y', labelY);
                labelText.textContent = `${step.totalWaitingTime.toFixed(0)}m`;
                svg.appendChild(labelText);
            }
        }
    });
}

/**
 * Classify step type for color coding in flowchart
 */
function classifyStepType(step) {
    const name = step.name.toLowerCase();
    const role = step.role.toLowerCase();

    // Value Added (VA): Direct work that transforms the product
    if (name.includes('create') || name.includes('address') || name.includes('merge') || name.includes('update')) {
        return 'VA';
    }

    // Essential Non-Value Added (ENVA): Necessary checks and controls
    if (role.includes('manager') || role.includes('senior') || name.includes('review') || 
        name.includes('testing') || name.includes('scan') || name.includes('security') || 
        name.includes('approval') || name.includes('pipeline') || name.includes('ci/cd') || 
        name.includes('quality')) {
        return 'ENVA';
    }

    // Non-Value Added (NVA): Waste or waiting
    return 'NVA';
}

/**
 * Render analysis results
 */
function renderAnalysisResults(results) {
    // Update key metrics
    document.getElementById('leadTimeValue').textContent = formatTime(results.overall.totalLeadTime);
    document.getElementById('valueAddedValue').textContent = formatTime(results.overall.totalValueAddedTime);
    document.getElementById('pceValue').textContent = results.overall.processCycleEfficiency.toFixed(1) + '%';

    // Render bottlenecks (default to wait time)
    showBottleneckTab('wait');

    // Render utilization chart
    renderUtilizationChart(results.roles);

    // Render step analysis chart
    renderBarChart(results.steps);
}

/**
 * Show bottleneck analysis tab
 */
function showBottleneckTab(type) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="showBottleneckTab('${type}')"]`).classList.add('active');

    // Sort and display bottlenecks
    let sortedSteps;
    if (type === 'wait') {
        sortedSteps = [...analysisResults.steps].sort((a, b) => b.totalWaitingTime - a.totalWaitingTime);
    } else {
        // For utilization, we need to calculate step-level utilization
        sortedSteps = [...analysisResults.steps].map(step => ({
            ...step,
            utilization: (step.totalProcessingTime / analysisResults.roles[step.role].capacityMinutes) * 100
        })).sort((a, b) => b.utilization - a.utilization);
    }

    const bottlenecksContent = document.getElementById('bottlenecksContent');
    bottlenecksContent.innerHTML = '';

    sortedSteps.slice(0, 5).forEach((step, index) => {
        const item = document.createElement('div');
        item.className = 'bottleneck-item';

        const value = type === 'wait' ?
            formatTime(step.totalWaitingTime / TOTAL_PR_VOLUME) :
            step.utilization.toFixed(1) + '%';

        const metric = type === 'wait' ? 'avg wait time' : 'utilization';

        item.innerHTML = `
            <div>
                <div class="bottleneck-name">${index + 1}. ${step.name}</div>
                <div class="bottleneck-metric">${step.role} • ${metric}</div>
            </div>
            <div class="bottleneck-value">${value}</div>
        `;

        bottlenecksContent.appendChild(item);
    });
}

/**
 * Render utilization chart
 */
function renderUtilizationChart(roles) {
    const chartContainer = document.getElementById('utilizationChart');
    chartContainer.innerHTML = '';

    Object.values(roles).forEach(role => {
        const bar = document.createElement('div');
        bar.className = 'utilization-bar';

        const utilization = Math.min(role.utilization, 100); // Cap at 100% for display
        const isOverCapacity = role.utilization > 100;

        bar.innerHTML = `
            <div class="utilization-label">${role.name}</div>
            <div class="utilization-fill">
                <div class="utilization-indicator" style="left: ${Math.min(utilization, 100)}%"></div>
            </div>
            <div class="utilization-percentage ${isOverCapacity ? 'status-error' : ''}">
                ${role.utilization.toFixed(1)}%
            </div>
        `;

        // Set the width of the fill
        bar.querySelector('.utilization-fill').style.width = utilization + '%';

        chartContainer.appendChild(bar);
    });
}

/**
 * Render step analysis bar chart
 */
function renderBarChart(steps) {
    const ctx = document.getElementById('analysisChart').getContext('2d');

    // Prepare data
    const labels = steps.map(step => step.name);
    const data = steps.map(step => step.processTimeMins); // Average processing time per PR

    // Destroy existing chart if it exists
    if (window.analysisChartInstance) {
        window.analysisChartInstance.destroy();
    }

    window.analysisChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Processing Time (minutes per PR)',
                data: data,
                backgroundColor: 'rgba(15, 61, 129, 0.8)',
                borderColor: 'rgba(15, 61, 129, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Time (minutes)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Process Steps'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Processing Time: ${context.parsed.y} minutes`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * Recalculate analysis with new capacity settings
 */
function recalculateAnalysis() {
    if (!vsmData) return;

    analysisResults = performAnalysis(vsmData);
    renderAnalysisResults(analysisResults);
    showStatus('Analysis recalculated with new capacity settings', 'success');
}

/**
 * Download flowchart as PDF
 */
async function downloadFlowchartPDF() {
    try {
        showStatus('Generating flowchart PDF...', 'success');
        
        // Wait a bit for any pending renders
        await new Promise(resolve => setTimeout(resolve, 500));

        const flowchartElement = document.querySelector('#processFlowchart');
        if (!flowchartElement) {
            throw new Error('Flowchart SVG element not found');
        }

        console.log('Flowchart element found:', flowchartElement);

        // Clone the element to avoid modifying the original
        const clonedElement = flowchartElement.cloneNode(true);
        
        // Create temporary container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.background = 'white';
        tempContainer.appendChild(clonedElement);
        document.body.appendChild(tempContainer);

        // Use html2canvas to convert SVG to canvas
        const canvas = await html2canvas(tempContainer, {
            backgroundColor: '#ffffff',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        // Remove temporary container
        document.body.removeChild(tempContainer);

        const imgData = canvas.toDataURL('image/png');
        console.log('Canvas image created');

        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // Calculate dimensions
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 10;
        const imgWidth = pageWidth - (2 * margin);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let yPosition = margin;
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);

        // Add additional pages if needed
        let remainingHeight = imgHeight - (pageHeight - margin);
        while (remainingHeight > 0) {
            pdf.addPage();
            yPosition -= (pageHeight - 2 * margin);
            pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            remainingHeight -= (pageHeight - 2 * margin);
        }

        // Generate filename with proper version
        const timestamp = new Date().toISOString().split('T')[0];
        const version = fileVersion || 'v1.0.0';
        const filename = `VSM_Flowchart_${version}_${timestamp}.pdf`;
        
        console.log('Saving PDF as:', filename);
        pdf.save(filename);
        
        showStatus('Flowchart PDF downloaded successfully!', 'success');

    } catch (error) {
        console.error('PDF generation error:', error);
        showStatus('Error generating flowchart PDF: ' + error.message, 'error');
    }
}

/**
 * Download analysis as PDF
 */
function downloadAnalysisPDF() {
    try {
        showStatus('Generating analysis PDF...', 'success');

        const pdf = new jspdf.jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 20;

        // Title
        pdf.setFontSize(20);
        pdf.text('VSM Analysis Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Metadata
        pdf.setFontSize(12);
        pdf.text(`Version: ${fileVersion}`, 20, yPosition);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 10;
        pdf.text(`File: ${currentFileName}`, 20, yPosition);
        pdf.text(`Creator: Gaurav Chonkar`, pageWidth - 20, yPosition, { align: 'right' });
        yPosition += 20;

        // Key Metrics
        pdf.setFontSize(16);
        pdf.text('Key Metrics (3-Month Scenario)', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(12);
        const metrics = [
            `Total PR Volume: ${TOTAL_PR_VOLUME} (${MONTHLY_PR_VOLUME} PRs/month × ${TOTAL_MONTHS} months)`,
            `Average Lead Time per PR: ${formatTime(analysisResults.overall.totalLeadTime)}`,
            `Value-Added Time per PR: ${formatTime(analysisResults.overall.totalValueAddedTime)}`,
            `Process Cycle Efficiency: ${analysisResults.overall.processCycleEfficiency.toFixed(1)}%`
        ];

        metrics.forEach(metric => {
            if (yPosition > pageHeight - 20) {
                pdf.addPage();
                yPosition = 20;
            }
            pdf.text(metric, 20, yPosition);
            yPosition += 10;
        });

        yPosition += 10;

        // Assumptions
        pdf.setFontSize(14);
        pdf.text('Analysis Assumptions', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        const assumptions = [
            '• 3-month analysis period',
            `• ${MONTHLY_PR_VOLUME} pull requests per month`,
            `• ${document.getElementById('peoplePerRole').value} people per role`,
            `• ${document.getElementById('hoursPerMonth').value} available hours per person per month`,
            '• Rework factor calculated as 1/(1-reworkProbability)',
            '• Lead time includes both processing and waiting time'
        ];

        assumptions.forEach(assumption => {
            if (yPosition > pageHeight - 20) {
                pdf.addPage();
                yPosition = 20;
            }
            pdf.text(assumption, 20, yPosition);
            yPosition += 8;
        });

        // Role Utilization
        yPosition += 15;
        if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = 20;
        }

        pdf.setFontSize(14);
        pdf.text('Role Utilization', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        Object.values(analysisResults.roles).forEach(role => {
            const status = role.utilization > 85 ? '(HIGH RISK)' : role.utilization > 70 ? '(MONITOR)' : '(OK)';
            pdf.text(`${role.name}: ${role.utilization.toFixed(1)}% ${status}`, 30, yPosition);
            yPosition += 8;
        });

        pdf.save(`VSM_Analysis_${fileVersion}_${new Date().toISOString().split('T')[0]}.pdf`);
        showStatus('Analysis PDF downloaded successfully!', 'success');

    } catch (error) {
        console.error('PDF generation error:', error);
        showStatus('Error generating analysis PDF: ' + error.message, 'error');
    }
}

/**
 * Utility functions
 */
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes.toFixed(1)} min`;
    } else if (minutes < 1440) { // 24 hours
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}m`;
    } else {
        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        return `${days}d ${hours}h`;
    }
}

function showStatus(message, type) {
    const statusDiv = document.createElement('div');
    statusDiv.className = `status-message status-${type}`;
    statusDiv.innerHTML = `
        <span>${message}</span>
    `;

    statusContainer.innerHTML = '';
    statusContainer.appendChild(statusDiv);

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (statusDiv.parentNode) {
                statusDiv.remove();
            }
        }, 5000);
    }
}