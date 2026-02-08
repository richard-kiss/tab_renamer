document.addEventListener('DOMContentLoaded', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const input = document.getElementById('nameInput');

    // Ask background for current custom name
    chrome.runtime.sendMessage({ action: "get_tab_name" }, (response) => {
        if (response && response.name) {
            input.value = response.name;
        } else {
            input.value = tab.title;
        }
    });

    document.getElementById('save').addEventListener('click', () => {
        const newName = input.value;
        if (newName) {
            chrome.runtime.sendMessage({
                action: "set_tab_name",
                tabId: tab.id,
                url: tab.url,
                newName: newName
            }, () => {
                window.close();
            });
        }
    });

    document.getElementById('reset').addEventListener('click', () => {
        chrome.runtime.sendMessage({
            action: "reset_tab_name",
            tabId: tab.id,
            url: tab.url
        }, () => {
            window.close();
        });
    });
});
