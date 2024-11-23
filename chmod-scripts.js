const fs = require('fs');
const path = require('path');

function setExecutable(filePath) {
	try {
		fs.chmodSync(filePath, '755');
	} catch (error) {
		console.error(`Failed to set executable: ${filePath} - ${error.message}`);
	}
}

function processDirectory(dirPath) {
	fs.readdirSync(dirPath).forEach((file) => {
		const fullPath = path.join(dirPath, file);
		if (fs.statSync(fullPath).isDirectory()) {
			processDirectory(fullPath);
		} else if (fullPath.endsWith('.sh')) {
			setExecutable(fullPath);
		}
	});
}

processDirectory(process.cwd());
