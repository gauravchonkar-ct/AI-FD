# Evaluation Testing Document: Markdown Renderer Application

## 1. Introduction

### 1.1 Purpose
This document outlines the evaluation testing procedures for the Markdown Renderer application. The testing focuses on verifying core functionality, user interface behavior, and data processing accuracy.

### 1.2 Scope
Testing covers:
- Markdown rendering functionality
- Action tracking system
- Reference management
- Theme switching
- File processing and data updates
- User interface responsiveness

### 1.3 Test Environment
- **Browser**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Operating System**: Windows 10+, macOS 10.14+, Linux (Ubuntu 18.04+)
- **Screen Resolution**: 1920x1080 (primary), 1366x768, 768x1024, 375x667 (mobile)
- **Network**: Online (for CDN dependencies), Offline capability verification

### 1.4 Test Data Requirements
- **Sample Markdown File 1**: `test-document.md` (includes various Markdown elements, task lists, TODO items, links)
- **Sample Markdown File 2**: `test-document-2.md` (different content for re-rendering tests)
- **Large File**: `large-document.md` (2MB+ for performance testing)

## 2. Test Cases

### 2.1 Markdown Rendering Tests

#### TC-001: Verify Expected Rendered Content Appears
**Test Case ID**: TC-001
**Test Type**: Functional
**Priority**: Critical
**Preconditions**:
- Application loaded in browser
- Test markdown file available

**Test Steps**:
1. Open the application in a web browser
2. Click the file input area or use Ctrl+O to open file dialog
3. Select and upload `test-document.md`
4. Wait for processing to complete

**Expected Results**:
- ✅ Formatted HTML appears in the content area
- ✅ Markdown elements (headers, lists, links, code blocks) are properly rendered
- ✅ No raw markdown syntax visible in rendered view
- ✅ Content is readable and properly formatted

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-002: View Toggle Functionality
**Test Case ID**: TC-002
**Test Type**: UI/Functional
**Priority**: High
**Preconditions**:
- Markdown file loaded and rendered

**Test Steps**:
1. Upload a markdown file
2. Click the "Raw" view toggle button
3. Verify raw markdown content displays
4. Click the "Rendered" view toggle button
5. Verify formatted HTML displays

**Expected Results**:
- ✅ Raw view shows original markdown with syntax highlighting
- ✅ Rendered view shows formatted HTML
- ✅ Toggle buttons show active state correctly
- ✅ Content switches smoothly between views

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

### 2.2 Actions Section Tests

#### TC-003: Actions Section Visibility
**Test Case ID**: TC-003
**Test Type**: UI
**Priority**: High
**Preconditions**:
- Markdown file with task lists or TODO items loaded

**Test Steps**:
1. Upload a markdown file containing `- [ ]` task items and `TODO:` keywords
2. Scroll down to view the actions section

**Expected Results**:
- ✅ Actions section is visible below content area
- ✅ Section shows any `- [ ]` or `TODO:` items from the document
- ✅ Progress bar displays completion percentage
- ✅ Filter tabs are visible (All, To Do, In Progress, Done, Blocked)

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-004: Checkbox Toggle Functionality
**Test Case ID**: TC-004
**Test Type**: Functional/UI
**Priority**: Critical
**Preconditions**:
- Actions section visible with task items

**Test Steps**:
1. Locate an unchecked action item
2. Click the checkbox next to the action item
3. Observe the changes

**Expected Results**:
- ✅ Item marks as done (checkbox checked)
- ✅ Progress bar updates to reflect new completion percentage
- ✅ Item status changes to "Done"
- ✅ Visual styling changes to indicate completion

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-005: Status Dropdown Changes
**Test Case ID**: TC-005
**Test Type**: Functional/UI
**Priority**: High
**Preconditions**:
- Actions section visible with items

**Test Steps**:
1. Click on a status dropdown for any action item
2. Change status from current value to "In Progress"
3. Change status again to "Blocked"
4. Observe visual changes

**Expected Results**:
- ✅ Status color changes according to new status
- ✅ Filter tabs respond correctly when filtering
- ✅ Progress calculation updates appropriately
- ✅ Visual indicators match status (colors, icons)

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-006: Filter Tab Functionality
**Test Case ID**: TC-006
**Test Type**: UI/Functional
**Priority**: High
**Preconditions**:
- Actions section with multiple items of different statuses

**Test Steps**:
1. Click on "To Do" filter tab
2. Click on "Done" filter tab
3. Click on "All" filter tab
4. Click on "In Progress" filter tab

**Expected Results**:
- ✅ List filters instantly to show only items matching selected status
- ✅ Active tab is visually highlighted
- ✅ Item count updates in section header
- ✅ Filtering is smooth and responsive

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

### 2.3 References Section Tests

#### TC-007: References Section Visibility
**Test Case ID**: TC-007
**Test Type**: UI
**Priority**: High
**Preconditions**:
- Markdown file with various links loaded

**Test Steps**:
1. Upload markdown file containing links, images, and references
2. Scroll to references section below actions

**Expected Results**:
- ✅ References section is visible below actions
- ✅ Shows all links grouped by type (External, Anchor, Email, Image)
- ✅ Each group shows count in header
- ✅ Links are properly categorized

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-008: External Link Functionality
**Test Case ID**: TC-008
**Test Type**: Functional
**Priority**: High
**Preconditions**:
- References section visible with external links

**Test Steps**:
1. Locate an external link in the references section
2. Click on the external link
3. Observe browser behavior

**Expected Results**:
- ✅ Link opens in new tab (target="_blank")
- ✅ Original application remains open
- ✅ Link includes rel="noopener" for security

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

### 2.4 Theme and Styling Tests

#### TC-009: Dark Mode Toggle
**Test Case ID**: TC-009
**Test Type**: UI/Functional
**Priority**: Medium
**Preconditions**:
- Application loaded with content

**Test Steps**:
1. Click the theme toggle button (moon/sun icon)
2. Observe theme changes across all sections
3. Click toggle again to switch back
4. Use keyboard shortcut Ctrl+Shift+D

**Expected Results**:
- ✅ All 3 sections (content, actions, references) theme correctly
- ✅ Background, text, and accent colors change appropriately
- ✅ Theme persists across page refreshes
- ✅ Keyboard shortcut works

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

### 2.5 File Processing Tests

#### TC-010: New File Loading
**Test Case ID**: TC-010
**Test Type**: Functional
**Priority**: Critical
**Preconditions**:
- One markdown file already loaded

**Test Steps**:
1. Upload a second markdown file (`test-document-2.md`)
2. Wait for processing to complete
3. Observe all sections update

**Expected Results**:
- ✅ All 3 sections re-render with new data
- ✅ Content area shows new document
- ✅ Actions section shows new action items
- ✅ References section shows new links
- ✅ Progress resets appropriately

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-011: File Validation
**Test Case ID**: TC-011
**Test Type**: Functional
**Priority**: High
**Preconditions**:
- Application loaded

**Test Steps**:
1. Try to upload a non-markdown file (.txt, .jpg, etc.)
2. Try to upload a file with wrong extension but .md content
3. Upload a valid .md file

**Expected Results**:
- ✅ Invalid file types rejected with error message
- ✅ File input resets on invalid files
- ✅ Valid markdown files process correctly
- ✅ Clear user feedback for validation failures

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-012: Drag and Drop Upload
**Test Case ID**: TC-012
**Test Type**: UI/Functional
**Priority**: High
**Preconditions**:
- Application loaded

**Test Steps**:
1. Locate a markdown file on desktop
2. Drag the file over the upload area
3. Drop the file in the upload zone
4. Verify processing begins

**Expected Results**:
- ✅ Drop zone highlights on drag over
- ✅ File processes normally after drop
- ✅ Visual feedback during drag operation
- ✅ Same validation as file picker upload

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

### 2.6 Performance Tests

#### TC-013: Large File Processing
**Test Case ID**: TC-013
**Test Type**: Performance
**Priority**: Medium
**Preconditions**:
- Large markdown file (2MB+) available

**Test Steps**:
1. Upload large markdown file
2. Time the processing duration
3. Monitor browser memory usage
4. Verify UI responsiveness during processing

**Expected Results**:
- ✅ File processes within 5 seconds
- ✅ UI remains responsive during processing
- ✅ Memory usage stays within reasonable limits
- ✅ No browser crashes or hangs

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

### 2.7 Accessibility Tests

#### TC-014: Keyboard Navigation
**Test Case ID**: TC-014
**Test Type**: Accessibility
**Priority**: High
**Preconditions**:
- Application loaded with content

**Test Steps**:
1. Use Tab key to navigate through interactive elements
2. Use Enter/Space to activate buttons
3. Test Ctrl+O for file dialog
4. Test Ctrl+Shift+D for theme toggle

**Expected Results**:
- ✅ All interactive elements reachable via keyboard
- ✅ Visual focus indicators present
- ✅ Keyboard shortcuts work
- ✅ Logical tab order maintained

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

#### TC-015: Screen Reader Compatibility
**Test Case ID**: TC-015
**Test Type**: Accessibility
**Priority**: High
**Preconditions**:
- Screen reader software available (NVDA, JAWS, VoiceOver)

**Test Steps**:
1. Enable screen reader
2. Navigate through the application
3. Verify content is announced correctly
4. Test form controls and dynamic content

**Expected Results**:
- ✅ Semantic HTML structure read correctly
- ✅ ARIA labels announced
- ✅ Dynamic content changes announced
- ✅ Interactive elements properly identified

**Actual Results**:
- [ ] Pass
- [ ] Fail

**Notes/Comments**:

---

## 3. Test Execution Guidelines

### 3.1 Test Execution Order
1. Execute critical priority tests first (TC-001, TC-004, TC-010)
2. Run UI tests in sequence after core functionality verified
3. Perform accessibility tests last
4. Re-run failed tests after fixes

### 3.2 Test Data Preparation
Create the following test files:

**test-document.md**:
```markdown
# Test Document

This is a test document with various markdown elements.

## Task List
- [ ] Complete project setup
- [x] Write documentation
- [ ] Implement features

## TODO Items
TODO: Review code quality
ACTION: Update dependencies
FIXME: Fix memory leak

## Links and References
[External Link](https://example.com)
[Internal Link](#section)
<Image](https://example.com/image.jpg)
<mailto:test@example.com>

## Code Block
```javascript
function test() {
  console.log("Hello World");
}
```
```

### 3.3 Reporting
- Document actual results for each test case
- Include screenshots for UI-related failures
- Note browser and environment details
- Record execution time and any performance issues

## 4. Success Criteria

### 4.1 Overall Pass Rate
- **Critical Tests**: 100% pass rate required
- **High Priority Tests**: 95% pass rate required
- **Medium Priority Tests**: 90% pass rate required

### 4.2 Quality Gates
- No critical security vulnerabilities
- WCAG 2.1 AA compliance for accessibility
- Performance within specified benchmarks
- Cross-browser compatibility maintained

## 5. Test Environment Cleanup

### 5.1 Post-Test Activities
- Clear browser cache and localStorage
- Reset theme preferences
- Close all browser tabs
- Document any environment-specific issues

### 5.2 Known Limitations
- CDN dependency availability affects offline testing
- Large file testing limited by available test data
- Screen reader testing requires specific software setup

---

**Document Version**: 1.0
**Created Date**: May 8, 2026
**Test Suite**: Markdown Renderer v1.0
**Total Test Cases**: 15
**Estimated Execution Time**: 2-3 hours</content>
<parameter name="filePath">c:\Users\GauravC2\Documents\AI FD\Sample HMTL project\Evaluation_Testing_Document.md