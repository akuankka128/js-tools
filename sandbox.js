async function sandboxif(code) {
	return new Promise(res => {
		var frame = document.createElement('iframe');
		frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
		frame.style.display = 'none';

		document.body.appendChild(frame);

		frame.contentWindow.document.open();
		frame.contentWindow.document.write(`<script>${code}</script>`);
		frame.contentWindow.document.close();

		frame.contentWindow.addEventListener('message', v => {
			frame.remove();
			res(v.data);
		});
	});
}

// usage:
var code = `
var a = 0, b = 1;
do {
	var temp = a + b;
	a = b;
	b = temp;
} while(b < 1000);
postMessage(b);`;

sandboxif(code)
	.then(console.log);
