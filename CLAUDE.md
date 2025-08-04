# QuickShot - Claude Development Context

## Project Overview
QuickShot is a simple Chrome extension for capturing and annotating screenshots. It focuses on local processing with no server dependencies.

## Architecture

### Core Files
- `manifest.json` - Extension configuration (Manifest V3)
- `background.js` - Service worker for screenshot capture
- `popup.html/js` - Extension popup interface
- `editor/` - Screenshot annotation editor

### Key Features
- **Screenshot Capture**: Visible area only
- **Annotation Tools**: Arrow drawing and highlight rectangles
- **Export Options**: Download PNG or copy to clipboard
- **Local Processing**: All editing happens in browser

## Development Notes

### Removed Features
- Text tool functionality has been removed
- Google Drive upload functionality has been removed (as of latest cleanup)
- OAuth and Drive API permissions removed from manifest

### Current Tools
1. **Arrow Tool** (`editor.js:289-324`)
   - Draws arrows with arrowheads
   - Configurable colors
2. **Highlight Tool** (`editor.js:270-287`)
   - Draws colored rectangles
   - Used for emphasizing areas

### Code Style
- Vanilla JavaScript (no frameworks)
- Modern ES6+ syntax
- Canvas 2D API for drawing
- Chrome Extension APIs (storage, scripting, etc.)

### Testing
- Load unpacked extension in `chrome://extensions/`
- Enable Developer mode
- Test capture and editing functionality

### Build Process
- No build process required
- Uses native browser APIs only
- Direct deployment to Chrome extensions

### Permissions Used
- `activeTab` - Access current tab for screenshots
- `scripting` - Inject capture UI
- `storage` - Store captured images temporarily
- `clipboardWrite` - Copy screenshots to clipboard

## Common Tasks

### Adding New Annotation Tools
1. Add tool button to `editor/index.html`
2. Add tool case to `updateCursor()` method
3. Add tool case to `drawAnnotation()` method
4. Implement draw method (e.g., `drawNewTool()`)

### Debugging
- Use Chrome DevTools on extension popup
- Use `chrome://extensions/` for service worker logs
- Editor page can be debugged like normal web page

### Future Enhancements
- Full page capture
- Additional annotation tools (text, shapes)
- Keyboard shortcuts
- Settings/preferences storage