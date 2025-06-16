let capturedData = [];

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "start_debugging") {
    console.log("Starting debugging");

    capturedData = [];
    chrome.storage.local.clear(() => {
      console.log("Storage cleared before starting debugging.");
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      chrome.debugger.attach({ tabId: tab.id }, "1.3", () => {
        console.log("Debugger attached");
        chrome.debugger.sendCommand({ tabId: tab.id }, "Network.enable", () => {
          console.log("Network monitoring enabled");

          sendResponse({ message: "Debugger and network monitoring started." });
        });
      });
    });

    return true;
  }

  if (message.action === "cleanup") {
    console.log("Cleanup triggered in background");

    capturedData = [];
    chrome.storage.local.clear(() => {
      console.log("Storage cleared upon cleanup.");
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        const tabId = tabs[0].id;
        chrome.debugger.detach({ tabId: tabId }, () => {
          console.log("Debugger detached.");
        });
      }
    });

    sendResponse({ message: "Cleanup completed." });
  }
});

chrome.debugger.onEvent.addListener((source, method, params) => {
  if (method === "Network.responseReceived") {
    const url = params.response.url;
    if (url.includes("GetAssistiveFeatures")) {
      chrome.debugger.sendCommand(
        { tabId: source.tabId },
        "Network.getResponseBody",
        { requestId: params.requestId },
        (response) => {
          if (response && response.body) {
            try {
              const body = JSON.parse(response.body || "{}");
              if (body) {
                let extractedData = handlePayload(body);
                if (extractedData.length > 0) {
                  capturedData.push(...extractedData);
                  chrome.storage.local.set({ capturedData });
                  console.log("Data extracted:", extractedData);
                } else {
                  console.error("No valid data found in payload.");
                }
              } else {
                console.error("Payload is missing or invalid:", body);
              }
            } catch (e) {
              console.error("Error parsing response:", e);
            }
          } else {
            console.error("No body in response:", response);
          }
        }
      );
    }
  }
});

function handlePayload(payload) {
  console.log("Payload is: ", payload[1]);
  let result = [];

  if (Array.isArray(payload) && payload.length === 2) {
    const [firstElement, secondElement] = payload;

    if (Array.isArray(secondElement)) {
      secondElement.forEach((item) => {
        if (Array.isArray(item)) {
          result.push(item[1][1]);
        } else {
          console.error("Item is not an array:", item);
        }
      });
    } else {
      console.error(
        "Second element in payload is not an array:",
        secondElement
      );
    }
  } else {
    console.error("Payload does not have the expected structure:", payload);
  }

  return result;
}

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function () {
      console.log("Extension is being suspended. Cleaning up...");

      chrome.storage.local.clear(() => {
        console.log("Storage cleared upon suspension.");
      });

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const tabId = tabs[0].id;
          chrome.debugger.detach({ tabId: tabId }, () => {
            console.log("Debugger detached.");
          });
        }
      });
    });
  }
});
