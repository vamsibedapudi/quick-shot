// ScribShot Editor - Arrow Drawing and Highlight Tools

class ScreenshotEditor {
  constructor() {
    this.canvas = document.getElementById('editorCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.wrapper = document.querySelector('.canvas-wrapper');

    // State
    this.image = null;
    this.scale = 1;
    this.activeTool = 'arrow';
    this.activeColor = '#FF0000';
    this.isDrawing = false;
    this.annotations = [];
    this.history = [];

    // Current drawing state
    this.currentAnnotation = null;
    this.startX = 0;
    this.startY = 0;

    this.init();
  }

  async init() {
    // Load captured image
    const data = await chrome.storage.local.get(['capturedImage', 'pageInfo']);
    if (data.capturedImage) {
      await this.loadImage(data.capturedImage);
    }

    this.setupEventListeners();
    this.updateCursor();
  }

  async loadImage(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.fitCanvasToViewport();
        this.redraw();
        this.saveHistory();
        resolve();
      };
      img.src = dataUrl;
    });
  }

  fitCanvasToViewport() {
    if (!this.image) return;

    const container = document.querySelector('.editor-container');
    const maxWidth = container.clientWidth - 40;
    const maxHeight = container.clientHeight - 40;

    // Calculate scale to fit
    const scaleX = maxWidth / this.image.width;
    const scaleY = maxHeight / this.image.height;
    this.scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

    // Set canvas dimensions
    this.canvas.width = this.image.width * this.scale;
    this.canvas.height = this.image.height * this.scale;

    // Set CSS dimensions
    this.canvas.style.width = this.canvas.width + 'px';
    this.canvas.style.height = this.canvas.height + 'px';

    // Enable image smoothing for scaled display
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  setupEventListeners() {
    // Tool selection
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = e.currentTarget.dataset.tool;
        if (tool) this.selectTool(tool);
      });
    });

    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.selectColor(e.currentTarget.dataset.color);
      });
    });

    // Canvas mouse events
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // Action buttons
    document.getElementById('downloadBtn').addEventListener('click', () => this.download());
    document.getElementById('copyBtn').addEventListener('click', () => this.copyToClipboard());
    document.getElementById('undoBtn').addEventListener('click', () => this.undo());


    // Window resize
    window.addEventListener('resize', () => {
      this.fitCanvasToViewport();
      this.redraw();
    });
  }

  selectTool(tool) {
    this.activeTool = tool;

    // Update UI
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === tool);
    });

    this.updateCursor();
  }

  selectColor(color) {
    this.activeColor = color;

    // Update UI
    document.querySelectorAll('.color-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.color === color);
    });
  }

  updateCursor() {
    // Remove all cursor classes
    this.canvas.className = '';

    // Add appropriate cursor class based on tool and drawing state
    if (this.isDrawing) {
      this.canvas.classList.add('drawing');
    }

    switch(this.activeTool) {
      case 'highlight':
        this.canvas.classList.add('highlight-cursor');
        break;
      case 'arrow':
        this.canvas.classList.add('arrow-cursor');
        break;
    }
  }

  getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) / this.scale,
      y: (e.clientY - rect.top) / this.scale
    };
  }

  handleMouseDown(e) {
    const pos = this.getMousePos(e);
    this.startX = pos.x;
    this.startY = pos.y;
    this.isDrawing = true;
    this.currentAnnotation = {
      type: this.activeTool,
      color: this.activeColor,
      startX: pos.x,
      startY: pos.y,
      endX: pos.x,
      endY: pos.y
    };
    // Update cursor to show we're drawing
    this.updateCursor();
  }

  handleMouseMove(e) {
    const pos = this.getMousePos(e);

    if (this.currentAnnotation) {
      this.currentAnnotation.endX = pos.x;
      this.currentAnnotation.endY = pos.y;

      // Redraw everything including the preview
      this.redrawWithPreview();
    }
  }

  handleMouseUp(e) {
    if (!this.isDrawing) return;

    if (this.currentAnnotation) {
      const pos = this.getMousePos(e);
      this.currentAnnotation.endX = pos.x;
      this.currentAnnotation.endY = pos.y;

      // Only save if meaningful size
      const width = Math.abs(this.currentAnnotation.endX - this.currentAnnotation.startX);
      const height = Math.abs(this.currentAnnotation.endY - this.currentAnnotation.startY);

      if (width > 5 || height > 5) {
        this.annotations.push(this.currentAnnotation);
        this.saveHistory();
      }

      this.currentAnnotation = null;
      this.redraw();
    }

    this.isDrawing = false;
    this.updateCursor();
  }

  handleMouseLeave(e) {
    if (this.isDrawing && this.currentAnnotation) {
      this.handleMouseUp(e);
    }
  }


  redraw() {
    if (!this.image) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw scaled image
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.image, 0, 0);

    // Draw all annotations
    this.annotations.forEach(ann => this.drawAnnotation(ann));

    this.ctx.restore();
  }

  redrawWithPreview() {
    if (!this.image) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw scaled image
    this.ctx.save();
    this.ctx.scale(this.scale, this.scale);
    this.ctx.drawImage(this.image, 0, 0);

    // Draw all saved annotations
    this.annotations.forEach(ann => this.drawAnnotation(ann));

    // Draw current annotation (preview)
    if (this.currentAnnotation) {
      this.drawAnnotation(this.currentAnnotation, true);
    }

    this.ctx.restore();
  }

  drawAnnotation(ann, isPreview = false) {
    switch(ann.type) {
      case 'highlight':
        this.drawHighlight(ann, isPreview);
        break;
      case 'arrow':
        this.drawArrow(ann, isPreview);
        break;
    }
  }

  drawHighlight(ann, isPreview) {
    const x = Math.min(ann.startX, ann.endX);
    const y = Math.min(ann.startY, ann.endY);
    const width = Math.abs(ann.endX - ann.startX);
    const height = Math.abs(ann.endY - ann.startY);

    this.ctx.strokeStyle = ann.color;
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    if (isPreview) {
      this.ctx.globalAlpha = 0.7;
    }

    this.ctx.strokeRect(x, y, width, height);
    this.ctx.globalAlpha = 1;
  }

  drawArrow(ann, isPreview) {
    const headLength = 15;
    const dx = ann.endX - ann.startX;
    const dy = ann.endY - ann.startY;
    const angle = Math.atan2(dy, dx);

    this.ctx.strokeStyle = ann.color;
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';

    if (isPreview) {
      this.ctx.globalAlpha = 0.7;
    }

    // Draw line
    this.ctx.beginPath();
    this.ctx.moveTo(ann.startX, ann.startY);
    this.ctx.lineTo(ann.endX, ann.endY);
    this.ctx.stroke();

    // Draw arrowhead
    this.ctx.beginPath();
    this.ctx.moveTo(ann.endX, ann.endY);
    this.ctx.lineTo(
      ann.endX - headLength * Math.cos(angle - Math.PI / 6),
      ann.endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.moveTo(ann.endX, ann.endY);
    this.ctx.lineTo(
      ann.endX - headLength * Math.cos(angle + Math.PI / 6),
      ann.endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.stroke();

    this.ctx.globalAlpha = 1;
  }


  saveHistory() {
    // Save a deep copy of current annotations state
    this.history.push(JSON.parse(JSON.stringify(this.annotations)));

    // Limit history size to prevent memory issues
    if (this.history.length > 50) {
      this.history = this.history.slice(-50);
    }
  }

  undo() {
    if (this.history.length > 1) {
      // Remove current state
      this.history.pop();
      // Restore previous state
      this.annotations = JSON.parse(JSON.stringify(this.history[this.history.length - 1]));
      this.redraw();
    } else if (this.history.length === 1) {
      // Go back to empty state
      this.history.pop();
      this.annotations = [];
      this.redraw();
    }
  }

  async download() {
    // Create full resolution canvas
    const downloadCanvas = document.createElement('canvas');
    const downloadCtx = downloadCanvas.getContext('2d');

    downloadCanvas.width = this.image.width;
    downloadCanvas.height = this.image.height;

    // Draw image and annotations at full resolution
    downloadCtx.drawImage(this.image, 0, 0);

    const tempCtx = this.ctx;
    this.ctx = downloadCtx;
    this.annotations.forEach(ann => this.drawAnnotation(ann, false));
    this.ctx = tempCtx;

    // Download
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:]/g, '-').split('.')[0];
    link.download = `screenshot-${timestamp}.png`;
    link.href = downloadCanvas.toDataURL('image/png');
    link.click();

    this.showNotification('Screenshot saved!');
  }

  async copyToClipboard() {
    try {
      // Create full resolution canvas
      const copyCanvas = document.createElement('canvas');
      const copyCtx = copyCanvas.getContext('2d');

      copyCanvas.width = this.image.width;
      copyCanvas.height = this.image.height;

      // Draw at full resolution
      copyCtx.drawImage(this.image, 0, 0);
      const tempCtx = this.ctx;
      this.ctx = copyCtx;
      this.annotations.forEach(ann => this.drawAnnotation(ann, false));
      this.ctx = tempCtx;

      // Convert to blob and copy
      copyCanvas.toBlob(async (blob) => {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        this.showNotification('Copied to clipboard!');
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy:', err);
      this.showNotification('Failed to copy to clipboard', 'error');
    }
  }


  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// Initialize editor when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ScreenshotEditor());
} else {
  new ScreenshotEditor();
}
