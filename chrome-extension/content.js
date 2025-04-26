(function() {
  // Prevent multiple injections
  if (window.__kasabridge_widget_injected) return;
  window.__kasabridge_widget_injected = true;

  // Create the iframe widget
  const widget = document.createElement('iframe');
  widget.src = chrome.runtime.getURL('widget.html');
  widget.id = 'kasabridge-widget';
  
  // Style the widget
  widget.style.position = 'fixed';
  widget.style.bottom = '30px';
  widget.style.right = '30px';
  widget.style.width = '400px';
  widget.style.height = '300px';
  widget.style.border = 'none';
  widget.style.borderRadius = '16px';
  widget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
  widget.style.zIndex = '2147483647'; // Maximum z-index
  widget.style.transition = 'all 0.3s ease';
  widget.style.background = 'white';
  widget.style.overflow = 'hidden';

  // Add the widget to the page
  document.body.appendChild(widget);

  // Variables for handling dragging
  let isDragging = false;
  let initialX, initialY;
  let currentX, currentY;
  let xOffset = 0, yOffset = 0;

  // Toggle button for showing/hiding the widget
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'kasabridge-toggle';
  toggleBtn.innerHTML = '<img src="' + chrome.runtime.getURL('assets/logo.png') + '" alt="KasaBridge" style="width: 24px; height: 24px;" />';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.bottom = '10px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.width = '40px';
  toggleBtn.style.height = '40px';
  toggleBtn.style.borderRadius = '50%';
  toggleBtn.style.backgroundColor = '#2563eb';
  toggleBtn.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  toggleBtn.style.border = 'none';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.display = 'flex';
  toggleBtn.style.alignItems = 'center';
  toggleBtn.style.justifyContent = 'center';
  toggleBtn.style.zIndex = '2147483646';
  document.body.appendChild(toggleBtn);

  // Initially hide the widget
  widget.style.display = 'none';
  
  // Toggle button functionality
  toggleBtn.addEventListener('click', function() {
    if (widget.style.display === 'none') {
      widget.style.display = 'block';
    } else {
      widget.style.display = 'none';
    }
  });

  // Handle messages from the iframe
  window.addEventListener('message', (event) => {
    // Only accept messages from our widget
    if (event.source !== widget.contentWindow) return;
    const { type, data } = event.data;
    
    if (type === 'DRAG_START') {
      isDragging = true;
      initialX = event.data.clientX;
      initialY = event.data.clientY;
      
      // Save the current position
      const transformMatrix = window.getComputedStyle(widget).transform;
      if (transformMatrix && transformMatrix !== 'none') {
        const matrix = new DOMMatrixReadOnly(transformMatrix);
        xOffset = matrix.m41;
        yOffset = matrix.m42;
      }
    } 
    else if (type === 'DRAG_MOVE') {
      if (isDragging) {
        // Calculate how much the mouse has moved
        currentX = event.data.clientX - initialX + xOffset;
        currentY = event.data.clientY - initialY + yOffset;
        
        // Apply the new position
        widget.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }
    else if (type === 'DRAG_END') {
      isDragging = false;
      // Save the final position
      xOffset = currentX;
      yOffset = currentY;
    } 
    else if (type === 'MINIMIZE_WIDGET') {
      if (widget.dataset.minimized === 'true') {
        widget.style.width = '400px';
        widget.style.height = '300px';
        widget.dataset.minimized = 'false';
      } else {
        widget.style.width = '150px';
        widget.style.height = '50px';
        widget.dataset.minimized = 'true';
      }
    } 
    else if (type === 'CLOSE_WIDGET') {
      widget.style.display = 'none';
    }
    else if (type === 'SHARE_AUDIO_TO_MEETING') {
      // Play the audio in the page context (best effort for browser limitations)
      const audio = document.createElement('audio');
      audio.src = data.audioUrl || event.data.audioUrl;
      audio.style.display = 'none';
      document.body.appendChild(audio);
      audio.play().then(() => {
        setTimeout(() => {
          audio.remove();
        }, 15000);
      });
      // Note: True microphone injection requires a virtual audio driver or tab capture, which is not possible with pure JS in content scripts.
      // This will play the audio in the tab, which is the closest possible in a Chrome extension context.
    }
  });
})();