const fs = require('fs');
const path = require('path');

const files = [
    'c:\\AntigravityWORKS\\蓮花院\\index.html',
    'c:\\AntigravityWORKS\\蓮花院\\redesign-v2\\index.html'
];

files.forEach(file => {
    try {
        const stats = fs.statSync(file);
        console.log(`${file}: ${stats.mtime.toISOString()}`);
    } catch (err) {
        console.error(`Error reading ${file}: ${err.message}`);
    }
});

const dir = 'c:\\AntigravityWORKS\\蓮花院\\redesign-v2';
try {
    const filesInDir = fs.readdirSync(dir).map(f => {
        const fullPath = path.join(dir, f);
        return { name: fullPath, time: fs.statSync(fullPath).mtime };
    }).sort((a, b) => b.time - a.time).slice(0, 5);

    console.log('\nTop 5 recently modified in redesign-v2:');
    filesInDir.forEach(f => console.log(`${f.name}: ${f.time.toISOString()}`));
} catch (err) {
    console.error(err);
}
