import path from 'path'

export default (src: DirPath, dest: DirPath) => {
	console.log(path.resolve(src))
	console.log(path.resolve(dest))
}