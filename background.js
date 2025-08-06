// Background service worker for ScribShot extension

// Listen for messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'capture') {
    // Handle capture from popup (includes tabId) or content script (uses sender.tab)
    if (request.tabId) {
      // Message from popup - get tab by ID
      chrome.tabs.get(request.tabId, (tab) => {
        handleCapture(tab, request.mode);
      });
    } else {
      // Message from content script
      handleCapture(sender.tab, request.mode);
    }
  } else if (request.action === 'openEditor') {
    openEditor(request.imageData, request.pageInfo);
  }
});

// Handle different capture modes
async function handleCapture(tab, mode) {
  // Check if we can inject scripts into this tab
  const isRestrictedPage = tab.url.startsWith('chrome://') ||
                          tab.url.startsWith('chrome-extension://') ||
                          tab.url.startsWith('moz-extension://') ||
                          tab.url.startsWith('edge://');

  // For restricted pages, only allow visible area capture
  if (isRestrictedPage && mode !== 'visible') {
    console.log('Restricted page detected, falling back to visible area capture');
    captureVisibleArea(tab);
    return;
  }

  switch (mode) {
    case 'visible':
      captureVisibleArea(tab);
      break;
  }
}

// Capture visible area
async function captureVisibleArea(tab) {
  try {
    const dataUrl = await chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' });
    openEditor(dataUrl, {
      url: tab.url,
      title: tab.title,
      captureMode: 'visible'
    });
  } catch (error) {
    console.error('Failed to capture visible area:', error);
  }
}

// Open editor with captured image
function openEditor(imageData, pageInfo) {
  // Store the image data and page info
  chrome.storage.local.set({
    capturedImage: imageData,
    pageInfo: pageInfo
  }, () => {
    // Open editor in new tab
    chrome.tabs.create({
      url: chrome.runtime.getURL('editor/index.html')
    });
  });
}

