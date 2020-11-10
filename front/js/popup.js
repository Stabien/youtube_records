document.getElementById('get-URL').addEventListener('click', async function() {
	chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, 'API');
	});
});
