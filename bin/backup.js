const path = require('path')

module.exports = (src, dest) => {
	console.log(path.resolve(src))
	console.log(path.resolve(dest))
}