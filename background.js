// background.js
// Handles storage logic, persistence, and navigation updates.

// Helper to get storage
const getStorage = (keys) => new Promise(resolve => chrome.storage.local.get(keys, resolve));
const setStorage = (items) => new Promise(resolve => chrome.storage.local.set(items, resolve));
const removeStorage = (keys) => new Promise(resolve => chrome.storage.local.remove(keys, resolve));

// Listen for messages from Content Script and Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "get_tab_name") {
        handleGetTabName(sender.tab, sendResponse);
        return true; // Async response
    } else if (request.action === "set_tab_name") {
        handleSetTabName(request.tabId, request.url, request.newName, sendResponse);
        return true;
    } else if (request.action === "reset_tab_name") {
        handleResetTabName(request.tabId, request.url, sendResponse);
        return true;
    }
});

async function handleGetTabName(tab, sendResponse) {
    if (!tab) { sendResponse({ name: null }); return; }

    const tabKey = `tab_${tab.id}`;
    const urlKey = `url_${tab.url}`;
    const wasOpenedFromAnotherTab = typeof tab.openerTabId === "number";

    const data = await getStorage([tabKey, urlKey]);

    if (data[tabKey]) {
        // Found explicit name for this tab session
        sendResponse({ name: data[tabKey] });
    } else if (data[urlKey] && !wasOpenedFromAnotherTab) {
        // Found fallback name for this URL
        // Adopt this name for the current tab session
        await setStorage({ [tabKey]: data[urlKey] });
        sendResponse({ name: data[urlKey] });
    } else {
        sendResponse({ name: null });
    }
}

async function handleSetTabName(tabId, url, newName, sendResponse) {
    const tabKey = `tab_${tabId}`;
    const urlKey = `url_${url}`;

    // Save for this tab session AND for this URL
    await setStorage({
        [tabKey]: newName,
        [urlKey]: newName
    });

    // Force update the tab immediately
    chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (name) => { document.title = name; },
        args: [newName]
    });

    sendResponse({ status: "success" });
}

async function handleResetTabName(tabId, url, sendResponse) {
    const tabKey = `tab_${tabId}`;
    const urlKey = `url_${url}`;

    await removeStorage([tabKey, urlKey]);

    // Reload to restore original title (simplest way)
    chrome.tabs.reload(tabId);

    sendResponse({ status: "success" });
}

// Handle Navigation
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const tabKey = `tab_${tabId}`;
        const data = await getStorage([tabKey]);

        if (data[tabKey]) {
            const customName = data[tabKey];

            // Re-apply the title (it might have been reset by navigation)
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                func: (name) => { document.title = name; },
                args: [customName]
            });

            // Update the URL key for persistence (so if we restart on this new URL, it works)
            if (tab.url) {
                const urlKey = `url_${tab.url}`;
                await setStorage({ [urlKey]: customName });
            }
        }
    }
});
