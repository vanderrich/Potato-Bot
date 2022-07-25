const fs = require('fs');
const path = require('path');

// Remove all files with the .js file extension from the given directory.
function cleanDir(dir, filter) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const fileInfo = fs.statSync(filePath);
        if (fileInfo.isFile()) {
            if (file.endsWith('.js') && (!filter(file))) {
                fs.unlinkSync(filePath);
            }
        } else if (fileInfo.isDirectory()) {
            cleanDir(filePath, filter);
        }
    }
}

cleanDir("./", (file) => file === 'jsFileCleaner.js');
console.log("Cleaned!");