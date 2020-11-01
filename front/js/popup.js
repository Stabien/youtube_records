document.getElementById('get-URL').addEventListener('click', async function() {
	let body = {
		url: "https://www.youtube.com/watch?v=lLiiHwYrEK0&ab_channel=NowadaysRecords"
	};
	fetch("http://localhost:8080/", {
			method: "POST",
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify(body)
	});
});
