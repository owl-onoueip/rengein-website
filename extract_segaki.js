const fs = require('fs');

try {
    const content = fs.readFileSync('c:/AntigravityWORKS/蓮花院/museum.html', 'utf16le');
    console.log("Read " + content.length + " characters.");

    let output = "--- EXTRACTED CONTENT ---\n";

    // Find Segaki section
    // Searching for keywords directly
    const keywords = ['施餓鬼', '秋の彼岸', 'segaki'];

    // Simple extraction of the whole body text for manual review
    // or finding specific blocks.
    // Let's dump the section around id="segaki" if it exists
    const segakiIndex = content.indexOf('id="segaki"');

    if (segakiIndex !== -1) {
        output += "[FOUND id='segaki']\n";
        // Extract a large chunk around it
        output += content.slice(segakiIndex, segakiIndex + 5000) + "\n";
    } else {
        output += "[id='segaki' NOT FOUND]\n";
        // Fallback: search for "施餓鬼"
        const textIndex = content.indexOf('施餓鬼');
        if (textIndex !== -1) {
            output += "[FOUND text '施餓鬼']\n";
            output += content.slice(textIndex - 100, textIndex + 2000) + "\n";
        }
    }

    // Also look for lists of years (archive data)
    output += "\n--- YEAR ARCHIVES ---\n";
    const yearMatches = content.matchAll(/(20[0-9]{2}|令和[0-9]+)年/g);
    for (const match of yearMatches) {
        output += match[0] + " found at index " + match.index + "\n";
        // Extract context for the first few unique years to see what they link to
        output += "Context: " + content.slice(match.index, match.index + 200) + "\n---\n";
    }

    fs.writeFileSync('c:/AntigravityWORKS/蓮花院/segaki_extract.txt', output, 'utf8');
    console.log("Extraction written to segaki_extract.txt");

} catch (e) {
    console.error("Error:", e.message);
}
