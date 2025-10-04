const path = require('path');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function getOpusStream(url, opts = {}) {
	const scriptPath = path.join(process.cwd(), 'ytdlp_wrapper.py');

	const py = new PythonShell(scriptPath, {
		pythonPath: opts.pythonPath,
		args: [url],
		mode: 'binary',
		pythonOptions: ['-u'],
	});

	py.end(function(err) {
		if (err) throw err;
	});

	return { stream: py.stdout, process: py };
}

module.exports = { sleep, getOpusStream };