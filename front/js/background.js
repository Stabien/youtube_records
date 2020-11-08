chrome.runtime.onMessage.addListener((request) => {
	if (request.message === "download") {
			chrome.downloads.download({ url: request.url, filename: request.fileName });
		}
	if (request.message === "downloadIcon") {
		chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
			chrome.browserAction.setIcon({
				tabId: tab.id,
				path: {
					"16": "../assets/icon_2_16.png",
					"48": "../assets/icon_2_48.png",
					"128": "../assets/icon_2.png"
				}
			});
			chrome.browserAction.setPopup({ popup: "download_popup.html" });
		});
	}
	if (request.message === "defaultIcon") {
		chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
			chrome.browserAction.setIcon({
				tabId: tab.id,
				path: {
					"16": "../assets/icon_1_16.png",
					"48": "../assets/icon_1_48.png",
					"128": "../assets/icon_1.png"
				}
			});
			chrome.browserAction.setPopup({ popup: "default_popup.html" });
		});
	}
});
