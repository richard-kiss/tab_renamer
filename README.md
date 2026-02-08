# Tab Renamer

Tab Renamer is a Chrome extension that allows you to rename your browser tabs and persists the custom names using local storage. This is useful for organizing your tabs and keeping track of important pages.

## Features

- **Rename Tabs:** Easily change the title of any tab to something more meaningful.
- **Persistence:** Custom names are saved and reapplied even after you reload the page or restart the browser (based on the URL).
- **Reset:** Quickly revert a tab's name to its original title.

## Installation

1. Clone this repository or download the source code.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked**.
5. Select the directory containing the extension files (`manifest.json`, `background.js`, etc.).

## Usage

1. Click on the Tab Renamer extension icon in the toolbar.
2. The popup will show the current title of the active tab.
3. Enter a new name in the input field.
4. Click **Save** to apply the new name.
5. To revert to the original title, click **Reset**.

## Permissions

This extension requires the following permissions:
- `storage`: To save and retrieve custom tab names.
- `activeTab`: To access the currently active tab.
- `scripting`: To execute scripts for updating the tab title.
- `tabs`: To query and manipulate tab properties.
- `host_permissions` (`<all_urls>`): To allow renaming on any website.

## Contributing

I cannot provide official support or fixes, but Pull Requests are welcome! Please feel free to submit a PR if you'd like to contribute.

## Disclaimer

This software is provided "as is", without warranty of any kind. The author is not responsible for any damages that may arise from the use of this extension.
