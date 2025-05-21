const path =require('path')
const greet = require('./greeting')

console.log('current File:', path.basename(__filename))
console.log('Directory:', path.basename(__dirname))
console.log(greet('Klab Team'))