const fs = require('fs');

const buffer = fs.readFileSync('c:/AntigravityWORKS/蓮花院/museum.html');
console.log("First 4 bytes hex:", buffer.slice(0, 4).toString('hex'));

if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    console.log("Detected UTF-16LE BOM");
} else if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
    console.log("Detected UTF-16BE BOM");
} else if (buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
    console.log("Detected UTF-8 BOM");
} else {
    console.log("No standard BOM detected. Might be UTF-8 (no BOM) or Shift_JIS.");
    // Try to detect widely used Shift_JIS characters if no BOM
    // e.g., <html (3C 68 74 6D 6C) is ASCII, common in all.
}

console.log("Total size:", buffer.length);
