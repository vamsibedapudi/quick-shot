// Background service worker for QuickShot extension

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
  } else if (request.action === 'uploadToDrive') {
    uploadToDrive(request.imageData, request.filename)
      .then(result => sendResponse(result))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  } else if (request.action === 'getAuthToken') {
    getAuthToken()
      .then(token => sendResponse({ success: true, token }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
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

// Google Drive Integration
async function getAuthToken() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(token);
      }
    });
  });
}

async function uploadToDrive(imageData, filename) {
  try {
    // Get auth token
    const token = await getAuthToken();

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Create metadata
    const metadata = {
      name: filename || `Screenshot_${new Date().toISOString()}.png`,
      mimeType: 'image/png'
    };

    // Create form data
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', blob);

    // Upload to Drive
    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: form
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const fileData = await response.json();

    // Get shareable link
    const shareResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileData.id}/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone'
      })
    });

    if (!shareResponse.ok) {
      throw new Error('Failed to create shareable link');
    }

    // Return file info with shareable link
    return {
      success: true,
      fileId: fileData.id,
      fileName: fileData.name,
      shareLink: `https://drive.google.com/file/d/${fileData.id}/view?usp=sharing`
    };

  } catch (error) {
    console.error('Drive upload error:', error);
    throw error;
  }
}
