// Popup script for ScribShot extension

document.addEventListener('DOMContentLoaded', () => {
  // Add click listeners to all option buttons
  document.getElementById('visible').addEventListener('click', () => {
    handleCaptureMode('visible');
  });

});

async function handleCaptureMode(mode) {
  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Send capture request to background script
    chrome.runtime.sendMessage({
      action: 'capture',
      mode: mode,
      tabId: tab.id
    });

    // Close the popup
    window.close();
  } catch (error) {
    console.error('Error handling capture mode:', error);
  }
}
