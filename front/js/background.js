
// Post request to server to download file on socket event
const socket = io.connect('https://youtube-converter-mp3-chrome.herokuapp.com/');
socket.on('fileUpload', (data) => {
	fetch('https://youtube-converter-mp3-chrome.herokuapp.com/download', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	})
	.then(file => file.blob())
	.then(blob => {
		const url = window.URL.createObjectURL(blob);
		const regex = new RegExp(/[:<>+;|*/\\]/, 'g');
		const filename = data.fileName.replaceAll(regex, '');
		chrome.downloads.download({ url: url, filename: filename });
		chrome.browserAction.setIcon({
			path: {
				'16': '../assets/icon1_16.png',
				'48': '../assets/icon1_48.png',
				'128': '../assets/icon1_128.png'
			}
		});
		chrome.browserAction.setPopup({ popup: 'default_popup.html' });
	});
});

socket.on('error', (data) => {
	alert(data.error);
	chrome.browserAction.setIcon({
		path: {
			'16': '../assets/icon1_16.png',
			'48': '../assets/icon1_48.png',
			'128': '../assets/icon1_128.png'
		}
	});
	chrome.browserAction.setPopup({ popup: 'default_popup.html' });
});

// Changing icon on conversion and download
chrome.runtime.onMessage.addListener((request) => {
	if (request.message === 'downloadIcon') {
		chrome.browserAction.setIcon({
			path: {
				'16': '../assets/icon2_16.png',
				'48': '../assets/icon2_48.png',
				'128': '../assets/icon2_128.png'
			}
		});
		chrome.browserAction.setPopup({ popup: 'download_popup.html' });
	}
	if (request.message === "defaultIcon") {
		chrome.browserAction.setIcon({
			path: {
				'16': '../assets/icon1_16.png',
				'48': '../assets/icon1_48.png',
				'128': '../assets/icon1_128.png'
			}
		});
		chrome.browserAction.setPopup({ popup: 'default_popup.html' });
	}
});
