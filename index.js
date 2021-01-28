// Initialize Firebase
const firebaseConfig = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: '',
	appId: '',
	measurementId: ''
};

firebase.initializeApp(firebaseConfig);

const inputFileId = 'inputFileId';
const storage = firebase.storage();

function sendFile(onProgress, onError, onComplete) {
	let inputFile = document.getElementById(inputFileId);

	if (inputFile.files.length === 0) {
		console.log('Nenhum arquivo selecionado');
		return;
	}

	let file = inputFile.files[0];

	try {
		let task = storage.ref('files/' + file.name).put(file);

		task.on(
			'state_changed',
			function progress(snapshot) {
				let percentual =
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('percentual sended', percentual);
				onProgress(snapshot);
			},
			function error(err) {
				console.log('err send', err);
				onError(err);
			},
			function complete() {
				task.snapshot.ref.getDownloadURL().then(function (downloadURL) {
					console.log('downloadURL', downloadURL);
					onComplete(downloadURL);
				});
			}
		);
	} catch (e) {
		console.log('error send file', e);
		onError(e);
	}
}
