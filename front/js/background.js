chrome.runtime.onMessage.addListener((request) => {
	if (request.message === "download") {
			chrome.downloads.download({ url: request.url, filename: request.fileName });
		}
});
