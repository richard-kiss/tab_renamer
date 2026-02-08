// content.js
// Runs on page load. Asks background for its name.

// Listen for title changes by the page itself and revert them if we have a custom name
let currentCustomTitle = null;
let observer = null;

function enforceTitle(name) {
    currentCustomTitle = name;
    if (document.title !== name) {
        document.title = name;
    }

    if (!observer) {
        const target = document.querySelector('title');
        if (target) {
            observer = new MutationObserver(() => {
                if (currentCustomTitle && document.title !== currentCustomTitle) {
                    document.title = currentCustomTitle;
                }
            });
            observer.observe(target, { childList: true, characterData: true, subtree: true });
        }
    }
}

// Ask background for name on load
chrome.runtime.sendMessage({ action: "get_tab_name" }, (response) => {
    if (response && response.name) {
        enforceTitle(response.name);
    }
});