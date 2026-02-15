const fs = require('fs');
console.log('--- ROOT index.html ---');
try { console.log(fs.statSync('index.html').mtime.toISOString()); } catch (e) { console.log(e.message) }
console.log('--- V2 index.html ---');
try { console.log(fs.statSync('redesign-v2/index.html').mtime.toISOString()); } catch (e) { console.log(e.message) }
console.log('--- V2 files ---');
try {
    fs.readdirSync('redesign-v2')
        .map(f => ({ n: f, t: fs.statSync('redesign-v2/' + f).mtime }))
        .sort((a, b) => b.t - a.t)
        .slice(0, 5)
        .forEach(f => console.log(f.n + ' ' + f.t.toISOString()));
} catch (e) { console.log(e.message) }
