const fs = require('fs');

try {
    // Reading as utf16le based on previous error hints
    console.log("Attempting to read as UTF-16LE...");
    const content = fs.readFileSync('c:/AntigravityWORKS/蓮花院/museum.html', 'utf16le');

    console.log("--- START OF FILE SNIPPET (UTF-16LE) ---");
    console.log(content.slice(0, 500));

    console.log("--- SEARCHING FOR YEARS/CONTENT ---");
    // Japanese characters for year might need careful handling if regex fails on encoding issues, 
    // but once loaded into JS string it should be fine.
    const yearMatches = content.match(/令和[0-9]+年|20[0-9]{2}年/g);
    console.log("Years found:", yearMatches ? [...new Set(yearMatches)] : "None");

    const videoMatches = content.match(/iframe|youtube/g);
    console.log("Video embeds found:", videoMatches ? videoMatches.length : 0);

    // Look for Segaki ID
    const segakiIndex = content.indexOf('id="segaki"');
    if (segakiIndex !== -1) {
        console.log("--- SEGAKI SECTION FOUND ---");
        // Print a larger chunk to see the content structure (videos/photos)
        console.log(content.slice(segakiIndex, segakiIndex + 3000));
    } else {
        console.log("id='segaki' NOT FOUND in UTF-16LE read.");
    }

} catch (e) {
    console.error("Error reading file:", e.message);
}
