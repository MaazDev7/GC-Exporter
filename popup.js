function updateProgressText() {
  chrome.storage.local.get("capturedData", (result) => {
    const data = result.capturedData || [];
    const count = data.length; // Number of emails found
    const progressText = `${count} email${count !== 1 ? "s" : ""} found`;
    document.querySelector(".progress").textContent = progressText;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateProgressText();
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.capturedData) {
    updateProgressText();
  }
});

document.getElementById("start").addEventListener("click", () => {
  chrome.storage.local.clear(() => {
    console.log("Storage cleared before starting debugging.");
  });

  chrome.runtime.sendMessage({ action: "start_debugging" }, (response) => {
    document.getElementById("status").textContent = response.message;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.tabs.reload(tabId, () => {
          chrome.tabs.onUpdated.addListener(function onUpdated(
            tabIdUpdated,
            changeInfo
          ) {
            if (tabIdUpdated === tabId && changeInfo.status === "complete") {
              chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["autoscroll.js"],
              });
              chrome.tabs.onUpdated.removeListener(onUpdated);
            }
          });
        });
      }
    });
  });
});

document.getElementById("view").addEventListener("click", () => {
  chrome.storage.local.get("capturedData", (result) => {
    const data = result.capturedData || [];

    if (data.length === 0) {
      alert("No captured data to download.");
      return;
    }

    const csvContent = data.map((item) => `"${item}"`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    chrome.storage.local.clear(() => {
      console.log("Storage cleared after CSV download.");
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      chrome.debugger.detach({ tabId: tab.id }, () => {
        console.log("Debugger detached after CSV download.");
      });
    });

    alert("CSV file downloaded.");
  });
});

chrome.runtime.connect({ name: "popup" });
