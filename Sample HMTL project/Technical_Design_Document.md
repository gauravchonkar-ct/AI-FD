# Technical Design Document: Markdown Renderer Application

## 1. Overview

### 1.1 Purpose
The Markdown Renderer is a lightweight, client-side web application that provides enhanced Markdown viewing capabilities with action tracking and reference management features. The application allows users to upload Markdown files and view them with additional functionality for tracking tasks, managing references, and maintaining productivity workflows.

### 1.2 Scope
- **In Scope**: Markdown rendering, action extraction and tracking, reference/link management, file upload via drag-and-drop or file picker, dark/light theme support
- **Out of Scope**: Server-side processing, user accounts, file storage, collaboration features

### 1.3 Target Users
- Technical writers and documentation authors
- Project managers tracking tasks in Markdown files
- Developers maintaining README files and documentation
- Knowledge workers using Markdown for note-taking and task management

## 2. Architecture

### 2.1 Technology Stack

#### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Custom properties (CSS variables) for theming, responsive design
- **Vanilla JavaScript (ES5)**: No framework dependencies for maximum portability
- **External Libraries**:
  - `marked.js`: Markdown parsing and HTML generation
  - `DOMPurify`: HTML sanitization for security

#### Key Design Decisions
- **Zero Dependencies**: Pure vanilla JavaScript to ensure the application works offline and has no external dependencies beyond CDN-hosted libraries
- **Single File Architecture**: Everything contained in one HTML file for easy distribution and deployment
- **Progressive Enhancement**: Core functionality works without JavaScript, enhanced features added via script

### 2.2 Application Structure

```
index.html (Single-file application)
├── HTML Structure
│   ├── Header (Title, theme toggle)
│   ├── File Input Zone (Drag & drop area)
│   ├── Content Display Area
│   ├── Actions Section (Task tracking)
│   ├── References Section (Link management)
│   └── Footer
├── CSS Styles
│   ├── Design Tokens (CSS Custom Properties)
│   ├── Light/Dark Theme Definitions
│   ├── Component Styles
│   └── Responsive Breakpoints
└── JavaScript Logic
    ├── File Processing
    ├── Markdown Rendering
    ├── Action Extraction & Management
    ├── Reference Extraction & Display
    ├── Theme Management
    └── UI Interactions
```

### 2.3 Data Flow

1. **File Input**: User selects/drops Markdown file
2. **File Validation**: Check file extension (.md, .markdown)
3. **Text Extraction**: Read file content as UTF-8 text
4. **Parallel Processing**:
   - Markdown → HTML conversion (via marked.js)
   - Action extraction from raw text
   - Reference extraction from raw text
5. **HTML Sanitization**: DOMPurify processes rendered HTML
6. **UI Updates**: Display rendered content, actions, and references
7. **State Management**: Track action statuses, current view mode, theme

## 3. Core Features

### 3.1 Markdown Rendering
- **Library**: marked.js with GitHub Flavored Markdown (GFM) support
- **Security**: DOMPurify sanitization with allowlisted tags and attributes
- **Features**:
  - Tables, code blocks, lists, links, images
  - Task lists (- [ ] and - [x])
  - Strikethrough, emphasis, headers
  - Blockquotes, horizontal rules

### 3.2 Action Tracking System

#### Action Sources
1. **GitHub Flavored Markdown Task Lists**:
   ```
   - [ ] Incomplete task
   - [x] Completed task
   ```

2. **Keyword-based Actions**:
   ```
   TODO: Implement feature X
   ACTION: Review pull request
   FIXME: Fix bug in parser
   HACK: Temporary workaround
   ```

#### Action States
- **To Do** (📌): Default state for new actions
- **In Progress** (🔄): Currently being worked on
- **Done** (✅): Completed actions
- **Blocked** (🚫): Cannot proceed due to dependencies

#### Features
- Real-time status updates
- Progress tracking with completion percentage
- Filtering by status
- Source attribution (task-list vs keyword, line numbers)

### 3.3 Reference Management

#### Link Types Detected
- **External Links**: HTTP/HTTPS URLs in Markdown format `[text](url)` or angle brackets `<url>`
- **Anchor Links**: Internal document anchors `#section`
- **Email Links**: `mailto:` links
- **Images**: Image references with alt text

#### Features
- Automatic link extraction and categorization
- Domain extraction for external links
- Visual icons for different link types
- Grouped display by link type
- Clickable links that open in new tabs (external only)

### 3.4 File Handling
- **Supported Formats**: .md, .markdown files
- **Input Methods**:
  - File picker dialog
  - Drag and drop
  - Keyboard shortcut (Ctrl+O)
- **Validation**: File type checking with user feedback
- **Metadata Display**: File size, word count, estimated reading time

### 3.5 User Interface

#### View Modes
- **Rendered View**: Formatted HTML output
- **Raw View**: Original Markdown with syntax highlighting

#### Theming
- **Light Theme**: Default, optimized for bright environments
- **Dark Theme**: Alternative, optimized for low-light conditions
- **Persistence**: Theme preference saved in localStorage
- **System Integration**: Respects `prefers-color-scheme` media query

#### Responsive Design
- **Mobile-first approach**: Optimized for mobile devices
- **Tablet support**: Adaptive layouts for medium screens
- **Desktop enhancement**: Full feature set on larger screens

## 4. Security Considerations

### 4.1 HTML Sanitization
- **DOMPurify Configuration**:
  - Allowlisted HTML tags for Markdown output
  - Restricted attributes to prevent XSS
  - Automatic `target="_blank"` for external links

### 4.2 Content Security Policy (CSP)
- **External Resources**: CDN-hosted libraries only
- **Inline Scripts**: All JavaScript embedded in HTML
- **Data URIs**: Not used, preventing data exfiltration

### 4.3 File Handling Security
- **Client-side Only**: No server upload or processing
- **File Type Validation**: Strict extension checking
- **UTF-8 Encoding**: Safe text processing only

## 5. Performance Optimization

### 5.1 Bundle Size
- **Single File**: ~50KB total (HTML + CSS + JS)
- **External Dependencies**: ~100KB (marked.js + DOMPurify via CDN)
- **No Images**: Icon use via Unicode emoji for minimal size

### 5.2 Runtime Performance
- **Lazy Processing**: Content processed only after file selection
- **Efficient DOM Updates**: Minimal reflows and repaints
- **Memory Management**: File content held in memory only during session

### 5.3 Loading Strategy
- **CDN Fallback**: Graceful degradation if CDN unavailable
- **Progressive Loading**: UI renders immediately, content loads asynchronously

## 6. Accessibility (A11y)

### 6.1 Standards Compliance
- **WCAG 2.1 AA**: Meets accessibility guidelines
- **Semantic HTML**: Proper heading hierarchy, landmarks
- **ARIA Attributes**: Screen reader support for dynamic content

### 6.2 Keyboard Navigation
- **Tab Order**: Logical navigation through interactive elements
- **Keyboard Shortcuts**:
  - `Ctrl+O`: Open file dialog
  - `Ctrl+Shift+D`: Toggle theme
- **Focus Management**: Visible focus indicators, proper focus trapping

### 6.3 Screen Reader Support
- **Alt Text**: Descriptive text for icons and images
- **Live Regions**: Status updates announced to screen readers
- **Semantic Roles**: Proper ARIA roles for custom components

## 7. Browser Support

### 7.1 Target Browsers
- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile Browsers**: iOS Safari 12+, Chrome Mobile 60+
- **Progressive Enhancement**: Graceful degradation for older browsers

### 7.2 Required APIs
- **File API**: FileReader for local file processing
- **Drag and Drop API**: Enhanced file input experience
- **localStorage**: Theme preference persistence
- **matchMedia**: System theme detection

## 8. Development and Deployment

### 8.1 Development Environment
- **No Build Process**: Direct HTML/CSS/JS editing
- **Version Control**: Git for source control
- **Testing**: Manual testing across target browsers
- **Multiple Variants**: Project contains both `index.html` (full-featured) and `Gaurav.html` (simplified version) for comparison and development purposes
- **Development Notes**: `virtual-gaurav.md` contains AI development methodology notes and project tracking information

### 8.2 Deployment
- **Static Hosting**: Any web server or CDN
- **Offline Capable**: Works without internet connection (except for CDN libraries)
- **Distribution**: Single HTML file for easy sharing

### 8.3 Maintenance
- **Library Updates**: Monitor CDN library versions
- **Security Patches**: Regular updates for dependencies
- **Browser Testing**: Compatibility checks with new browser versions

## 9. Future Enhancements

### 9.1 Potential Features
- **Export Functionality**: Save rendered HTML or PDF
- **Search**: Full-text search within documents
- **Multiple Files**: Tabbed interface for multiple documents
- **Collaboration**: Real-time editing (requires server)
- **Extensions**: Plugin system for custom Markdown features

### 9.2 Technical Improvements
- **Service Worker**: Offline functionality for CDN libraries
- **WebAssembly**: Faster Markdown parsing
- **PWA Features**: Installable web app
- **Performance Monitoring**: Core Web Vitals tracking

## 10. Conclusion

The Markdown Renderer application demonstrates a balance between functionality and simplicity. By leveraging modern web APIs and carefully selected libraries, it provides a robust Markdown viewing experience while maintaining the portability and security benefits of a client-side, single-file application.

The architecture prioritizes user experience through progressive enhancement, accessibility, and performance optimization, making it suitable for both casual users and power users who need advanced features like action tracking and reference management.

---

**Document Version**: 1.0
**Last Updated**: May 8, 2026
**Author**: AI Assistant
**Application Version**: Current (index.html)</content>
<parameter name="filePath">c:\Users\GauravC2\Documents\AI FD\Sample HMTL project\Technical_Design_Document.md