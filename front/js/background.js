const socket = io.connect('https://youtube-converter-mp3-chrome.herokuapp.com/');
// Post request to server to download file on socket event
socket.on('fileUpload', (data) => {
	fetch("https://youtube-converter-mp3-chrome.herokuapp.com/download", {
		method: "POST",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(data)
	})
	.then(file => file.blob())
	.then(blob => {
		const url = window.URL.createObjectURL(blob);
		const regex = new RegExp(/[:<>+;*/\\]/, 'g');
		const fileName = data.fileName.replaceAll(regex, '');
		console.log(fileName);
		chrome.downloads.download({ url: url, filename: fileName });
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
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
	});
});

// Changing icon on conversion
chrome.runtime.onMessage.addListener((request) => {
	if (request.message === "downloadIcon") {
		chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
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
});
