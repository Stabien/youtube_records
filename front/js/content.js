chrome.runtime.onMessage.addListener((request) => {
	if (request === "API") {
		let body = {
			url: window.location.href
		};
		alert('Convertion en cours');
		console.log(body.url);
		fetch("http://localhost:8080/", {
				method: "POST",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(body)
		})
		.then(response => response.json())
		.then(response => {
			console.log(response.fileName);
			fetch("http://localhost:8080/download")
				.then(file => file.blob())
				.then(blob => {
					const url = window.URL.createObjectURL(blob);
					console.log(url);
					chrome.runtime.sendMessage({url: url, message: "download", fileName: response.fileName});
				});
				console.log('ok');
			console.log(response);
		});
	}
});
