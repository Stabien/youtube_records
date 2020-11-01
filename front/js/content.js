chrome.runtime.onMessage.addListener(function(request) {
	var url = window.location.href;
	var input = document.getElementsByTagName('input');

	if (request === 'hash_password') {
		chrome.storage.sync.get(url, function(result) {
			console.log(Object.values(result));
			if (Object.values(result).length === 0) 
				alert('Aucun mot de passe trouvé pour ce site');
			else {
				for (var i = 0; i < input.length; i++) {
					if (input[i].getAttribute('type') === 'password') {
						let input_passwd = input[i];
						input_passwd.value = Object.values(result);
					}
					console.log(Object.values(result));
				}
			}
		});
	}
	if (request === 'add_password') {
		var passwd = prompt('Veuillez saisir un mot de passe');
		var id = {};

		id[url] = passwd;

		if (passwd != null && passwd.length != 0) 
			chrome.storage.sync.set(id);
	}
});