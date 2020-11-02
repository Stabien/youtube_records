document.getElementById('get-URL').addEventListener('click', async function() {
	let body = {
		url: "https://www.youtube.com/watch?v=lLiiHwYrEK0&ab_channel=NowadaysRecords"
	};
	fetch("http://localhost:8080/", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
	})
	.then(response => response.json())
	.then(response => {
		console.log(response.fileName);
		setTimeout(() => {
			fetch("http://localhost:8080/download")
				.then(file => file.blob())
				.then(blob => {
					const url = window.URL.createObjectURL(blob);
					chrome.downloads.download({ url: url, filename: response.fileName });
				});
				console.log('ok');
		}, 5000);
		console.log(response);
	});
});
