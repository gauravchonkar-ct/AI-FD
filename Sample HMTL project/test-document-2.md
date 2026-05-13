# Second Test Document

This is a second test document to verify that the application correctly re-renders all sections when a new file is loaded.

## Different Task List
- [ ] Set up CI/CD pipeline
- [ ] Configure monitoring
- [x] Write API documentation
- [ ] Implement caching layer

## Different TODO Items
TODO: Optimize database queries
ACTION: Refactor legacy code
FIXME: Resolve security vulnerability
HACK: Implement temporary logging solution

## Different Links

### Development Resources
[React Documentation](https://reactjs.org)
[Node.js Guide](https://nodejs.org/en/docs)
[Express.js](https://expressjs.com)

### Company Links
[Company Website](https://company.com)
[Developer Portal](https://dev.company.com)
[Status Page](https://status.company.com)

### Contact
[Dev Team](mailto:dev@company.com)
[Support](mailto:support@company.com)

## Different Code Example

### TypeScript
```typescript
interface ActionItem {
  id: number;
  text: string;
  status: 'todo' | 'progress' | 'done' | 'blocked';
  source: string;
  line: number;
}

class ActionTracker {
  private actions: ActionItem[] = [];

  addAction(action: ActionItem): void {
    this.actions.push(action);
  }

  getCompletedCount(): number {
    return this.actions.filter(a => a.status === 'done').length;
  }

  getProgress(): number {
    return this.actions.length > 0
      ? (this.getCompletedCount() / this.actions.length) * 100
      : 0;
  }
}
```

## Different Table

| Component | Version | Status |
|-----------|---------|--------|
| Frontend | 2.1.0 | ✅ Stable |
| Backend | 1.8.3 | 🔄 Updating |
| Database | 5.7 | ⚠️ Deprecated |
| Cache | 3.2.1 | ✅ Stable |

## Summary

This document has different content from the first test document to ensure that:
- All sections properly clear old data
- New actions are extracted correctly
- New references are categorized properly
- Progress calculations reset appropriately
- UI updates reflect the new content

---

*End of second test document*</content>
<parameter name="filePath">c:\Users\GauravC2\Documents\AI FD\Sample HMTL project\test-document-2.md