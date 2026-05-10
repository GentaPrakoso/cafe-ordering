// gen-pass.js
const bcrypt = require('bcryptjs');
const password = '123'; // password yang kamu inginkan
const hash = bcrypt.hashSync(password, 10);
console.log('Hash bcrypt untuk', password, ':', hash);