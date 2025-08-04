# QuickShot

<p align="center">
  <img src="icons/icon128.png" alt="QuickShot Logo" width="128" height="128">
</p>

<p align="center">
  A simple, powerful Chrome extension for capturing and annotating screenshots with built-in Google Drive integration.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#development">Development</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Features

- 📸 **Multiple Capture Modes**
  - Visible area capture

- ✏️ **Built-in Editor**
  - Highlight important areas
  - Add arrows and pointers
  - Insert text annotations

- ☁️ **Google Drive Integration**
  - One-click upload to your Drive

- 🚀 **Fast & Lightweight**
  - No dependencies
  - Native browser APIs

## Installation

### From Chrome Web Store
*Coming soon! Star this repo to get notified when it's available.*

### From Source (Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/quickshot-extension.git
   cd quickshot-extension
   ```
2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the extension directory

## Usage

### Taking a Screenshot

1. Click the QuickShot icon in your Chrome toolbar
2. Choose your capture mode:
   - **Visible Area** - Captures what you see

### Editing

After capture, the editor opens automatically:

- **Highlight** 🖍️ - Draw attention to important areas
- **Arrow** ➡️ - Point to specific elements
- **Text** 📝 - Add annotations
- **Blur** 🔍 - Hide sensitive information

### Sharing

- **Download** 💾 - Save to your computer
- **Copy** 📋 - Copy to clipboard
- **Upload to Drive** ☁️ - Get a shareable link instantly


## Development

### Project Structure

```
quickshot-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── capture.js            # Content script for captures
├── capture-ui.css        # Capture UI styles
├── editor/
│   ├── index.html        # Editor interface
│   └── editor.js         # Editor logic
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── generate-icons.html   # Icon generator utility
└── README.md
```

### Building from Source

No build process required! This extension uses vanilla JavaScript and native browser APIs.

### Testing

1. Make your changes
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Test your changes

## Architecture

Based on the **Modern Screenshot Extension - Architecture Design** principles:

- **Minimal dependencies** - Uses native browser APIs
- **Simple architecture** - Easy to understand and contribute to
- **Modern UI** - Clean, intuitive interface
- **Performance first** - Fast captures and editing

## Contributing

We love contributions! Here's how to help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Ideas

- 🌍 Add internationalization
- 🎨 Create custom themes
- 🔧 Add more annotation tools
- 📱 Improve responsive design
- 🧪 Write tests
- 📚 Improve documentation

## Privacy

- All image processing happens locally in your browser
- Screenshots are never sent to our servers
- Google Drive uploads use Google's secure OAuth
- You control where your screenshots are stored

## Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/quickshot-extension/issues)
- 💡 **Feature Requests**: [Discussions](https://github.com/yourusername/quickshot-extension/discussions)
- 💬 **Community Chat**: [Discord Server](#)
- 📧 **Email**: support@quickshot.example.com

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors
- Inspired by the need for a simple, privacy-focused screenshot tool
- Built with ❤️ for the open source community

---

<p align="center">
  If you find this extension useful, please consider:
  <br><br>
  <a href="https://github.com/yourusername/quickshot-extension">⭐ Starring the repository</a>
  <br>
  <a href="#">☕ Buying me a coffee</a>
</p>
