# GC Exporter

**GC Exporter** is a lightweight Chrome extension that helps you extract email addresses from your Google Contacts page and download them in a CSV format with a single click.

---

## 📌 Features

- ✅ One-click start and stop email extraction
- 📥 Export all captured emails to a `contacts.csv` file
- 🔁 Auto-scrolls Google Contacts to ensure all emails are fetched
- 💾 Uses Chrome's debugger API to capture network responses
- ⚡ Clean, responsive popup interface

---

## 🛠 How It Works

1. Navigate to [Google Contacts](https://contacts.google.com/)
2. Open the extension popup
3. Click the **Start** button
4. The extension will:
   - Attach Chrome’s debugger
   - Monitor network traffic
   - Automatically scroll the page
   - Capture all visible email addresses
5. Once you're done, click **Download** to export the emails to a CSV file

---

## 📂 Project Structure

```bash
📁 GC Exporter/
├── manifest.json # Chrome extension manifest
├── background.js # Handles debugger, network capturing, cleanup
├── popup.js # UI interaction, triggers script and CSV download
├── popup.html # Extension UI
├── autoScroll.js # Scrolls through contacts to fetch all data
├── icon.png # Extension icon
```

---

## 🔒 Permissions Used

- `"debugger"`: Required to intercept network traffic from Google Contacts
- `"activeTab"`: Used to operate on the currently open tab
- `"storage"`: Saves the extracted email data locally
- `"scripting"`: Injects the auto-scroll script into the Google Contacts page
- `"host_permissions": ["<all_urls>"]`: Required to listen to network events on the active tab

---

## 🧪 Development & Testing

1. Clone or download this repo
2. Go to `chrome://extensions/` in your Chrome browser
3. Enable **Developer Mode**
4. Click **Load Unpacked** and select the folder containing these files
5. Navigate to [contacts.google.com](https://contacts.google.com/)
6. Launch the extension and begin extraction

---

## 📤 Output

- A CSV file named `contacts.csv` will be downloaded
- Each row contains one email address

---

## ⚠️ Notes

- Do **not close** the Google Contacts tab while extraction is running
- Emails are extracted from the `GetAssistiveFeatures` API response used internally by Google Contacts — changes in this structure may require updates to the extension
- For personal and educational use only. Please respect Google’s terms of service.

```
