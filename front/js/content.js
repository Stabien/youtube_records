chrome.runtime.sendMessage({ message: 'defaultIcon' });
chrome.runtime.onMessage.addListener((request) => {
	if (request === "API") {
		const re = /^(http(s)??\:\/\/)?(www\.)?((youtube\.com\/watch\?v=)|(youtu.be\/))([a-zA-Z0-9\-_])+/;
		let body = {
			url: window.location.href
		};
		if (re.test(body.url) == false) {
			alert("Mauvaise URL");
			return false;
		}
		alert('Conversion en cours');
		chrome.runtime.sendMessage({ message: 'downloadIcon' });
		fetch("https://youtube-converter-mp3-chrome.herokuapp.com/", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
		})
		.then(response => response.json())
		.then(response => {
			if (response.erreur != null) {
				alert('Impossible de convertir cette vidéo');
			}
			else {
				fetch("https://youtube-converter-mp3-chrome.herokuapp.com/download", {
					method: "POST",
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify(response)
				})
				.then(file => file.blob())
				.then(blob => {
					const url = window.URL.createObjectURL(blob);
					chrome.runtime.sendMessage({ url: url, message: "download", fileName: response.fileName });
					chrome.runtime.sendMessage({ message: 'defaultIcon' });
				});
		  }
		});
	}
});
