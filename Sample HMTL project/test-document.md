# Test Document

This is a comprehensive test document with various markdown elements to verify the Markdown Renderer application functionality.

## Task List
- [ ] Complete project setup
- [x] Write documentation
- [ ] Implement user authentication
- [ ] Add payment processing
- [ ] Deploy to production

## TODO Items
TODO: Review code quality and add unit tests
ACTION: Update dependencies to latest versions
FIXME: Fix memory leak in data processing module
HACK: Temporary workaround for API rate limiting

## Links and References

### External Links
[GitHub Repository](https://github.com/example/repo)
[Documentation Site](https://docs.example.com)
[API Reference](https://api.example.com/v1/docs)

### Internal Links
[Jump to Task List](#task-list)
[Jump to Code Examples](#code-examples)

### Email Links
[Contact Support](mailto:support@example.com)
[Send Feedback](mailto:feedback@example.com)

### Images
![Logo](https://example.com/logo.png)
![Screenshot](https://example.com/screenshot.jpg)

## Code Examples

### JavaScript
```javascript
function processMarkdown(content) {
  // Parse markdown content
  const html = marked.parse(content);

  // Sanitize for security
  const cleanHtml = DOMPurify.sanitize(html);

  return cleanHtml;
}

// Usage
const result = processMarkdown('# Hello World');
console.log(result);
```

### Python
```python
def extract_actions(markdown_text):
    """Extract TODO items and task lists from markdown"""
    actions = []

    # Find task list items
    for line in markdown_text.split('\n'):
        if '- [ ]' in line or '- [x]' in line:
            actions.append(line.strip())

    return actions

# Test the function
text = """
- [ ] Task 1
- [x] Task 2
TODO: Something important
"""

print(extract_actions(text))
```

## Tables

| Feature | Status | Priority |
|---------|--------|----------|
| Markdown Rendering | ✅ Complete | High |
| Action Tracking | ✅ Complete | High |
| Reference Management | ✅ Complete | Medium |
| Dark Mode | ✅ Complete | Low |
| Export Functionality | ❌ Pending | Low |

## Blockquotes

> This is a blockquote that demonstrates how the renderer handles quoted text. It can span multiple lines and include various formatting.

> **Nested Quote**
> This shows nested blockquotes for more complex documentation structures.

## Lists

### Ordered List
1. First item
2. Second item
3. Third item
   1. Nested item
   2. Another nested item

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

## Text Formatting

**Bold text** and *italic text* and ~~strikethrough text~~ and `inline code`.

## Horizontal Rules

---

Content above the rule

---

Content below the rule

## Special Characters

- Emojis: 🎉 ✅ ❌ 🚀
- Symbols: © ® ™ ° ± ∞
- Math: E = mc², π ≈ 3.14159
- Quotes: "Hello World" and 'single quotes'

---

*This document was created for testing the Markdown Renderer application. It includes various elements to ensure comprehensive functionality verification.*</content>
<parameter name="filePath">c:\Users\GauravC2\Documents\AI FD\Sample HMTL project\test-document.md