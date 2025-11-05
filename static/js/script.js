const pageFrame = document.getElementById('pageFrame');
const logContent = document.getElementById('logContent');
const pageLinks = document.querySelectorAll('.page-link');
const clearLogBtn = document.getElementById('clearLogBtn');
const toggleLogBtn = document.getElementById('toggleLogBtn');
const messageLog = document.querySelector('.message-log');
const variablesSelect = document.getElementById('variablesSelect');
const editVariablesBtn = document.getElementById('editVariablesBtn');
const variablesModal = document.getElementById('variablesModal');
const closeModal = document.querySelector('.close-modal');
const variableSetForm = document.getElementById('variableSetForm');
const variableSetsList = document.getElementById('variableSetsList');
const addSetBtn = document.getElementById('addSetBtn');
const setName = document.getElementById('setName');
const setVariables = document.getElementById('setVariables');
const saveSetBtn = document.getElementById('saveSetBtn');
const cancelSetBtn = document.getElementById('cancelSetBtn');
const deleteSetBtn = document.getElementById('deleteSetBtn');
const configBtn = document.getElementById('configBtn');
const helpBtn = document.getElementById('helpBtn');
const configModal = document.getElementById('configModal');
const closeConfigModal = document.getElementById('closeConfigModal');
const displayInlineCheckbox = document.getElementById('displayInlineCheckbox');
const saveConfigBtn = document.getElementById('saveConfigBtn');
const cancelConfigBtn = document.getElementById('cancelConfigBtn');
const noPageSelected = document.querySelector('.no-page-selected');
const newTabModeMessage = document.querySelector('.new-tab-mode-message');
let currentEmail = '';
let currentVariables = null;
let currentSetId = null;
let variableSets = {};
let isLogExpanded = true; // Start expanded by default
let displayInline = true; // Configuration: Display Custom Page inline (on by default)
let pageViewerTab = null; // Reference to the page viewer tab
let crossTabChannel = null; // BroadcastChannel for cross-tab communication
let isMessageLogResizing = false; // Message log resizing state
let messageLogStartY = 0; // Start Y position for message log resize
let messageLogStartHeight = 0; // Start height for message log resize

// Function to validate JSON
function validateJSON(jsonString) {
    try {
        JSON.parse(jsonString);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to add log entry
function addLogEntry(eventType, page, variables, direction = 'inbound') {
    // Create timestamp
    const now = new Date();
    const timestamp = now.toLocaleTimeString();

    // Create log entry
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    // Format the message content
    let messageContent = `<span class="timestamp">[${timestamp}]</span>`;
    
    if (direction === 'outbound') {
        messageContent += `<span class="event outbound">Message from Main Page to ${page}</span>`;
    } else {
        messageContent += `<span class="event">${eventType}</span>`;
        if (page) {
            messageContent += ` from <span class="page">${page}</span>`;
        }
    }
    
    if (variables) {
        messageContent += ` with variables: <span class="variables">${JSON.stringify(variables, null, 2)}</span>`;
    } else {
        messageContent += ` with no variables`;
    }

    logEntry.innerHTML = messageContent;
    logContent.appendChild(logEntry);
    
    // Scroll to bottom
    logContent.scrollTop = logContent.scrollHeight;
}

// Clear log functionality
clearLogBtn.addEventListener('click', () => {
    logContent.innerHTML = '';
});

// Toggle message log functionality
toggleLogBtn.addEventListener('click', () => {
    isLogExpanded = !isLogExpanded;
    
    if (isLogExpanded) {
        messageLog.classList.remove('collapsed');
        messageLog.classList.add('expanded');
    } else {
        messageLog.classList.remove('expanded');
        messageLog.classList.add('collapsed');
    }
});

// Function to update display mode message
function updateDisplayModeMessage() {
    if (displayInline) {
        // Inline mode - let CSS handle the display based on iframe content
        noPageSelected.style.display = '';
        newTabModeMessage.style.display = 'none';
    } else {
        // New tab mode - show new tab mode message
        noPageSelected.style.display = 'none';
        newTabModeMessage.style.display = 'block';
    }
}

// Initialize message log state
messageLog.classList.add('expanded');

// Initialize cross-tab messaging
function initializeCrossTabMessaging() {
    if ('BroadcastChannel' in window) {
        crossTabChannel = new BroadcastChannel('custom-page-handler');
        
        crossTabChannel.addEventListener('message', (event) => {
            const { type, data } = event.data;
            
            switch (type) {
                case 'TAB_READY':
                    console.log('Page viewer tab is ready');
                    break;
                case 'TAB_CLOSED':
                    console.log('Page viewer tab closed');
                    pageViewerTab = null;
                    break;
                case 'IFRAME_MESSAGE':
                    // Handle messages from iframe in the new tab
                    handleIframeMessage(data);
                    break;
            }
        });
    }
}

// Handle messages from iframe (either in main page or new tab)
function handleIframeMessage(data) {
    const { event: eventType, page, variables } = data;
    
    // Log the inbound message
    addLogEntry(eventType, page, variables, 'inbound');
    
    if (variables) {
        // Store email if present
        if (variables.email) {
            currentEmail = variables.email;
        }
    }

    // Handle READY event
    if (eventType === 'READY') {
        const message = {
            event: 'message',
            variables: currentVariables || {}
        };
        
        // Get the current page name from the active link
        const activeLink = document.querySelector('.page-link.active');
        const currentPage = activeLink ? activeLink.dataset.page : 'unknown';
        
        // Send message to iframe (either in main page or new tab)
        if (displayInline) {
            // Send to iframe in main page
            pageFrame.contentWindow.postMessage(message, '*');
            addLogEntry('message', currentPage, currentVariables || {}, 'outbound');
        } else if (crossTabChannel) {
            // Send to iframe in new tab
            crossTabChannel.postMessage({
                type: 'SEND_MESSAGE',
                data: { message: message }
            });
            addLogEntry('message', currentPage, currentVariables || {}, 'outbound');
        }
    }
}

// Resizer functionality
const resizer = document.getElementById('resizer');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');
let isResizing = false;
let startX = 0;
let startWidth = 0;

// Prevent text selection during resize
function preventTextSelection() {
    document.body.classList.add('resizing');
}

function restoreTextSelection() {
    document.body.classList.remove('resizing');
}

resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = sidebar.offsetWidth;
    
    resizer.classList.add('active');
    preventTextSelection();
    
    // Prevent default to avoid text selection
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {
        // Handle sidebar resizing
        e.preventDefault();
        
        const deltaX = e.clientX - startX;
        const newWidth = startWidth + deltaX;
        
        // Better constraints - minimum 200px, maximum 50% of viewport width
        const minWidth = 200;
        const maxWidth = Math.min(600, window.innerWidth * 0.5);
        
        // Clamp the width to the constraints
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        
        sidebar.style.width = `${clampedWidth}px`;
        sidebar.style.flexShrink = '0';
        sidebar.style.flexGrow = '0';
    } else if (isMessageLogResizing) {
        // Handle message log resizing
        e.preventDefault();
        
        const deltaY = messageLogStartY - e.clientY; // Inverted for vertical resize
        const newHeight = messageLogStartHeight + deltaY;
        
        // Better constraints - minimum 100px, maximum 80% of viewport height
        const minHeight = 100;
        const maxHeight = Math.min(400, window.innerHeight * 0.8);
        
        // Clamp the height to the constraints
        const clampedHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
        
        const messageLogElement = document.querySelector('.message-log');
        if (messageLogElement) {
            messageLogElement.style.height = `${clampedHeight}px`;
            messageLogElement.style.flex = 'none';
            messageLogElement.style.flexShrink = '0';
            messageLogElement.style.flexGrow = '0';
        }
    }
});

document.addEventListener('mouseup', () => {
    if (isResizing) {
        isResizing = false;
        resizer.classList.remove('active');
        restoreTextSelection();
    } else if (isMessageLogResizing) {
        isMessageLogResizing = false;
        messageLogResizer.classList.remove('active');
        restoreTextSelection();
    }
});

// Handle mouse leave to prevent stuck resize state
document.addEventListener('mouseleave', () => {
    if (isResizing) {
        isResizing = false;
        resizer.classList.remove('active');
        restoreTextSelection();
    } else if (isMessageLogResizing) {
        isMessageLogResizing = false;
        messageLogResizer.classList.remove('active');
        restoreTextSelection();
    }
});

// Handle window resize to maintain proportions
window.addEventListener('resize', () => {
    const currentWidth = sidebar.offsetWidth;
    const maxWidth = Math.min(600, window.innerWidth * 0.5);
    
    if (currentWidth > maxWidth) {
        sidebar.style.width = `${maxWidth}px`;
    }
});

// Handle escape key to cancel resize
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('active');
            restoreTextSelection();
        } else if (isMessageLogResizing) {
            isMessageLogResizing = false;
            messageLogResizer.classList.remove('active');
            restoreTextSelection();
        }
    }
});

// Handle page selection
pageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state
        pageLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Get the page URL from href attribute
        const pageUrl = link.getAttribute('href');
        
        // If it's the enter-code page and we have an email, append it
        const url = pageUrl.includes('enter-code') && currentEmail 
            ? `${pageUrl}?email=${encodeURIComponent(currentEmail)}`
            : pageUrl;

        // Load the page based on configuration
        if (!displayInline) {
            // Open in new tab when checkbox is checked
            openPageInNewTab(url);
        } else {
            // Load in iframe on main page when checkbox is unchecked
            pageFrame.src = url;
        }
    });
});

// Function to open page in new tab
function openPageInNewTab(pageUrl) {
    // Check if tab is already open and reuse it
    if (pageViewerTab && !pageViewerTab.closed) {
        // Tab exists and is open - just send the new page URL
        if (crossTabChannel) {
            crossTabChannel.postMessage({
                type: 'LOAD_PAGE',
                data: { url: pageUrl }
            });
        }
        // Focus the existing tab
        pageViewerTab.focus();
        return;
    }
    
    // No existing tab - create new one
    pageViewerTab = window.open('/page-viewer', '_blank');
    
    // Wait for tab to load, then send the page URL
    const checkTabReady = () => {
        if (pageViewerTab && !pageViewerTab.closed) {
            try {
                // Send the page URL to load
                if (crossTabChannel) {
                    crossTabChannel.postMessage({
                        type: 'LOAD_PAGE',
                        data: { url: pageUrl }
                    });
                }
            } catch (error) {
                // Tab might not be ready yet, try again
                setTimeout(checkTabReady, 100);
            }
        }
    };
    
    // Start checking after a short delay
    setTimeout(checkTabReady, 100);
}

// Handle messages from the iframe
window.addEventListener('message', (event) => {
    // Only handle messages if we're in inline mode
    if (displayInline) {
        handleIframeMessage(event.data);
    }
});

// Variable Sets Management
async function loadVariableSets() {
    try {
        const response = await fetch('/api/variable-sets');
        if (response.ok) {
            variableSets = await response.json();
            updateVariableSetsList();
            updateVariablesSelect();
        } else {
            console.error('Failed to load variable sets:', response.statusText);
        }
    } catch (error) {
        console.error('Error loading variable sets:', error);
    }
}

async function saveVariableSet(setId, variableSet) {
    try {
        const url = setId ? `/api/variable-sets/${setId}` : '/api/variable-sets';
        const method = setId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(variableSet)
        });
        
        if (response.ok) {
            const result = await response.json();
            console.log('Save response:', result);
            if (!setId) {
                // For new sets, update the variableSets object with the returned ID
                variableSets[result.id] = result.variable_set;
                console.log('Added new variable set:', result.id, result.variable_set);
            } else {
                // For existing sets, update the variableSets object with the new data
                variableSets[setId] = result.variable_set;
                console.log('Updated existing variable set:', setId, result.variable_set);
            }
            updateVariableSetsList();
            updateVariablesSelect();
            return true;
        } else {
            const error = await response.json();
            console.error('Failed to save variable set:', error.error);
            return false;
        }
    } catch (error) {
        console.error('Error saving variable set:', error);
        return false;
    }
}

async function deleteVariableSetFromServer(setId) {
    try {
        const response = await fetch(`/api/variable-sets/${setId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            delete variableSets[setId];
            updateVariableSetsList();
            updateVariablesSelect();
            return true;
        } else {
            const error = await response.json();
            console.error('Failed to delete variable set:', error.error);
            return false;
        }
    } catch (error) {
        console.error('Error deleting variable set:', error);
        return false;
    }
}

function updateVariableSetsList() {
    variableSetsList.innerHTML = '';
    Object.entries(variableSets).forEach(([id, set]) => {
        const item = document.createElement('div');
        item.className = 'variable-set-item';
        item.innerHTML = `
            <span class="variable-set-name">${set.name}</span>
            <div class="variable-set-actions">
                <button class="variable-set-btn edit-set-btn" data-id="${id}">Edit</button>
                <button class="variable-set-btn delete-set-btn" data-id="${id}">Delete</button>
            </div>
        `;
        variableSetsList.appendChild(item);
    });

    // Add event listeners to the buttons
    variableSetsList.querySelectorAll('.edit-set-btn').forEach(btn => {
        btn.addEventListener('click', () => editVariableSet(btn.dataset.id));
    });

    variableSetsList.querySelectorAll('.delete-set-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteVariableSet(btn.dataset.id));
    });
}

function updateVariablesSelect() {
    variablesSelect.innerHTML = '<option value="">Select a variable set...</option>';
    Object.entries(variableSets).forEach(([id, set]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = set.name;
        variablesSelect.appendChild(option);
    });
}

function showVariableSetForm(setId = null) {
    currentSetId = setId;
    variableSetForm.style.display = 'block';
    variableSetsList.style.display = 'none';
    addSetBtn.style.display = 'none';

    if (setId) {
        const set = variableSets[setId];
        setName.value = set.name;
        setVariables.value = JSON.stringify(set.variables, null, 2);
        deleteSetBtn.style.display = 'block';
    } else {
        setName.value = '';
        setVariables.value = JSON.stringify({
            "sessionData": null,
            "constants": null
        }, null, 2);
        deleteSetBtn.style.display = 'none';
    }
}

function hideVariableSetForm() {
    variableSetForm.style.display = 'none';
    variableSetsList.style.display = 'block';
    addSetBtn.style.display = 'block';
    currentSetId = null;
    setName.value = '';
    setVariables.value = '';
    deleteSetBtn.style.display = 'none';
}

function editVariableSet(id) {
    showVariableSetForm(id);
}

async function deleteVariableSet(id) {
    if (confirm('Are you sure you want to delete this variable set?')) {
        const success = await deleteVariableSetFromServer(id);
        if (success) {
            hideVariableSetForm();
        } else {
            alert('Failed to delete variable set. Please try again.');
        }
    }
}

// Event Listeners for Variable Sets
editVariablesBtn.addEventListener('click', () => {
    console.log('Opening variables modal');
    variablesModal.classList.add('active');
    hideVariableSetForm();
});

closeModal.addEventListener('click', () => {
    console.log('Closing variables modal');
    variablesModal.classList.remove('active');
    hideVariableSetForm();
});

addSetBtn.addEventListener('click', () => {
    console.log('Adding new variable set');
    showVariableSetForm();
});

cancelSetBtn.addEventListener('click', () => {
    console.log('Canceling variable set form');
    hideVariableSetForm();
});

variableSetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('Submitting variable set form');
    
    try {
        const variables = JSON.parse(setVariables.value);
        const name = setName.value.trim();
        
        if (!name) {
            alert('Please enter a name for the variable set');
            return;
        }

        const variableSet = {
            name,
            variables
        };

        const success = await saveVariableSet(currentSetId, variableSet);
        if (success) {
            hideVariableSetForm();
        } else {
            alert('Failed to save variable set. Please try again.');
        }
    } catch (error) {
        alert('Invalid JSON format: ' + error.message);
    }
});

deleteSetBtn.addEventListener('click', () => {
    if (currentSetId) {
        deleteVariableSet(currentSetId);
    }
});

variablesSelect.addEventListener('change', () => {
    const setId = variablesSelect.value;
    console.log('Variable set selected:', setId);
    if (setId && variableSets[setId]) {
        currentVariables = variableSets[setId].variables;
        console.log('Current variables updated:', currentVariables);
        
        // Send variables to the current page (either iframe or new tab)
        if (displayInline && pageFrame.src !== 'about:blank') {
            // Send to iframe in main page
            const activeLink = document.querySelector('.page-link.active');
            const currentPage = activeLink ? activeLink.dataset.page : 'unknown';
            
            pageFrame.contentWindow.postMessage({
                event: 'message',
                variables: currentVariables
            }, '*');
            
            addLogEntry('message', currentPage, currentVariables, 'outbound');
        } else if (!displayInline && crossTabChannel) {
            // Send to iframe in new tab
            const activeLink = document.querySelector('.page-link.active');
            const currentPage = activeLink ? activeLink.dataset.page : 'unknown';
            
            crossTabChannel.postMessage({
                type: 'SEND_MESSAGE',
                data: { 
                    message: {
                        event: 'message',
                        variables: currentVariables
                    }
                }
            });
            
            addLogEntry('message', currentPage, currentVariables, 'outbound');
        }
    } else {
        currentVariables = null;
        console.log('No variable set selected, currentVariables set to null');
    }
});

// Initialize
loadVariableSets();
initializeCrossTabMessaging();
// Don't automatically select the first page anymore
// pageLinks[0].click();

// Help button functionality
helpBtn.addEventListener('click', () => {
    window.open('/help', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
});

// Configuration Dialog Event Listeners
configBtn.addEventListener('click', () => {
    configModal.classList.add('active');
    // Set current state
    displayInlineCheckbox.checked = displayInline;
});

closeConfigModal.addEventListener('click', () => {
    configModal.classList.remove('active');
});

cancelConfigBtn.addEventListener('click', () => {
    configModal.classList.remove('active');
});

saveConfigBtn.addEventListener('click', () => {
    const previousMode = displayInline;
    
    // Save configuration (checkbox checked = new tab mode, so displayInline = false)
    displayInline = displayInlineCheckbox.checked;
    
    // Store in localStorage for persistence
    localStorage.setItem('displayInline', displayInline.toString());
    
    // Handle mode switching
    if (previousMode !== displayInline) {
        if (displayInline) {
            // Switching TO inline mode - close any open new tab and reset iframe
            if (pageViewerTab && !pageViewerTab.closed) {
                // Notify the new tab to close itself
                if (crossTabChannel) {
                    crossTabChannel.postMessage({
                        type: 'CLOSE_TAB',
                        data: {}
                    });
                }
                pageViewerTab.close();
                pageViewerTab = null;
            }
            // Reset iframe to blank to show "No Page Selected"
            pageFrame.src = 'about:blank';
            // Clear any active page selection
            pageLinks.forEach(link => link.classList.remove('active'));
        } else {
            // Switching TO new tab mode - clear iframe content
            pageFrame.src = 'about:blank';
            // Clear any active page selection
            pageLinks.forEach(link => link.classList.remove('active'));
        }
    }
    
    // Update display mode message
    updateDisplayModeMessage();
    
    // Close modal
    configModal.classList.remove('active');
    
    // Log configuration change
    addLogEntry('CONFIG_CHANGE', null, { displayInline: displayInline }, 'inbound');
});

// Load configuration from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedDisplayInline = localStorage.getItem('displayInline');
    
    if (savedDisplayInline !== null) {
        displayInline = savedDisplayInline === 'true';
        displayInlineCheckbox.checked = !displayInline; // Checkbox checked = new tab mode
    } else {
        // No saved value, use defaults
        displayInline = true; // Default to inline mode
        displayInlineCheckbox.checked = false; // Default checkbox unchecked
    }
    
    // Update display mode message
    updateDisplayModeMessage();
    
    // Check if this is the first visit and show help
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
        // Mark as visited
        localStorage.setItem('hasVisited', 'true');
        // Show help page after a short delay
        setTimeout(() => {
            window.open('/help', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
        }, 1000);
    }
    
    // Message Log Resizer functionality
    const messageLogResizer = document.getElementById('messageLogResizer');
    const messageLogElement = document.querySelector('.message-log');
    
    if (messageLogResizer) {
        messageLogResizer.addEventListener('mousedown', (e) => {
            isMessageLogResizing = true;
            messageLogStartY = e.clientY;
            messageLogStartHeight = messageLogElement.offsetHeight;
            
            messageLogResizer.classList.add('active');
            preventTextSelection();
            
            // Prevent default to avoid text selection
            e.preventDefault();
        });
    }
});

// Close modal when clicking outside
configModal.addEventListener('click', (e) => {
    if (e.target === configModal) {
        configModal.classList.remove('active');
    }
});
