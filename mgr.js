import fs from 'fs';
import path from 'path';

const themesDir = './themes';
const folders = fs.readdirSync(themesDir).filter(f =>
    fs.statSync(path.join(themesDir, f)).isDirectory()
);

const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Select Theme</title>
<style>
  dialog { padding: 1.5em; border-radius: 8px; }
  label { display: block; margin-bottom: 0.5em; }
  select { width: 100%; padding: 0.4em; }
</style>
</head>
<body>
<dialog open>
  <form method="dialog">
    <label for="themeSelect">Choose a theme:</label>
    <select id="themeSelect" name="theme">
        ${folders.map(f => `<option value="${f}">${f}</option>`).join('\n')}
    </select>
    <menu>
        <button value="cancel">Cancel</button>
        <button value="ok">OK</button>
    </menu>
  </form>
</dialog>
</body>
</html>
`;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, this is a simple Node.js web server!');
});

fs.writeFileSync('dialog.html', html);
console.log('dialog.html created');
console.log(JSON.stringify(folders));