# ScribShot - Claude Development Context

## Project Overview
ScribShot is a simple Chrome extension for capturing and annotating screenshots. It focuses on local processing with no server dependencies.

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

### Available Tools
1. **Arrow Tool** (`editor.js:288-323`)
   - Draws arrows with arrowheads
   - 4 available colors: yellow, red, green, blue
2. **Highlight Tool** (`editor.js:269-286`)
   - Draws colored rectangles for emphasizing areas
   - Same 4 color options as arrow tool

### Code Style
- Vanilla JavaScript (no frameworks)
- Modern ES6+ syntax
- Canvas 2D API for drawing
- Chrome Extension APIs (storage, etc.)

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

## Release Process

### Creating Release Package for Chrome Web Store

1. **Pre-flight Check**
   - Ensure all functionality works in unpacked extension
   - Verify permissions are minimal and correct
   - Test screenshot capture and annotation tools

2. **Create Release Zip**
   ```bash
   zip -r scribshot.zip . -x "*.git*" "*.DS_Store*" "README.md" "LICENSE" "CLAUDE.md" "PRIVACY.md" "*assets*" "*.claude*"
   ```

3. **Move to Assets**
   ```bash
   mv scribshot.zip assets/
   ```

4. **Chrome Web Store Upload**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole/)
   - Upload `assets/scribshot.zip`
   - Fill out store listing details
   - Submit for review

### Files Included in Release
- `manifest.json` - Extension configuration
- `background.js` - Service worker
- `popup.html` & `popup.js` - Extension popup
- `capture-ui.css` - Minimal capture UI styles
- `editor/` - Screenshot annotation editor
- `icons/` - Extension icons

### Files Excluded from Release
- Documentation files (README.md, CLAUDE.md, PRIVACY.md, LICENSE)
- Git files and .DS_Store
- Assets folder (promotional images)
- Claude settings

### Future Enhancements
- Full page capture
- Additional annotation tools (text, shapes)
- Keyboard shortcuts
- Settings/preferences storage