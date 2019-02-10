import fs from 'fs'
import path from 'path'
import { flattenDeep } from 'lodash'

const mapDir = async dir => new Promise((resolve, reject) => {
	fs.readdir(dir, { withFileTypes: true }, (err, files) => {
		if (err) return reject(err)

		const promises = []
		const map = []

		files.forEach(item => {
			if (item.isFile()) map.push({ name: item.name, type: 'file' })
			if (item.isDirectory()) {
				promises.push(
					mapDir(`${dir}/${item.name}`).then(subMap => map.push(subMap))
				)
			}
		})

		Promise.all(promises).then(() => resolve({ name: dir, type: 'dir', items: map}))
	})
})

const getPaths = (map) => {
	const paths = map.items.map(item => {
		if (item.type === 'file') return `${map.name}/${item.name}`
		return getPaths(item)
	})

	return flattenDeep(paths)
}

const getSingleStat = path => new Promise((resolve, reject) => {
	fs.stat(path, (err, stats) => err 
		? reject(err)
		: resolve({ name: path, modified: stats.mtimeMs, size: stats.size }))
})

const getStats = paths => {
	return Promise.all(paths.map(path => getSingleStat(path)))
}

exports.mapDir = mapDir
exports.getPaths = getPaths
exports.getStats = getStats