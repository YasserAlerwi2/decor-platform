// ملف بدء تشغيل مخصص لـ Hostinger Node.js
// استخدمه في حقل "Application startup file" إذا لم يعمل next start مباشرة

const { spawn } = require('child_process');
const path = require('path');

const port = process.env.PORT || 3000;
const nextBin = path.join(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next');

const child = spawn('node', [nextBin, 'start', '-p', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code));
