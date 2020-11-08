if (typeof(document.getElementById('get-URL')) != 'undefined' && document.getElementById('get-URL') != null) {
	document.getElementById('get-URL').addEventListener('click', async function() {
		chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, 'API');
		});
	});
}
