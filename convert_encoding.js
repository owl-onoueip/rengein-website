const fs = require('fs');

try {
    // Read original as UTF-16LE
    console.log("Reading museum.html as UTF-16LE...");
    const content = fs.readFileSync('c:/AntigravityWORKS/蓮花院/museum.html', 'utf16le');

    // Write as UTF-8 to the new location
    console.log("Writing to redesign-v2/autumn.html as UTF-8...");
    fs.writeFileSync('c:/AntigravityWORKS/蓮花院/redesign-v2/autumn.html', content, 'utf8');

    console.log("Conversion complete. Size: " + content.length + " chars.");
} catch (e) {
    console.error("Error:", e.message);
}
