const { mapDir, getPaths, getStats } = require('../lib/map-dir.js')

describe('map-dir.js', () => {
	let result

	beforeEach(() => {
		result = {
			name: '/Users/jeremy/Dev/mrsync/_test-src',
			type: 'dir',
			items: [
				{ name: 'image.png', type: 'file' },
				{ name: 'text.txt', type: 'file' },
				{
					name: '/Users/jeremy/Dev/mrsync/_test-src/second-dir',
					type: 'dir',
					items: [
						{ name: 'second.txt', type: 'file' }
					]
				},
				{
					name: '/Users/jeremy/Dev/mrsync/_test-src/sub-dir',
					type: 'dir',
					items: [
						{ name: 'nested.js', type: 'file' },
						{
							name: '/Users/jeremy/Dev/mrsync/_test-src/sub-dir/sub-sub-dir',
							type: 'dir',
							items: [
								{ name: 'deep.txt', type: 'file' }
							]
						}
					]
				}
			]
		}
	})

	test('Creates a map', async () => {
		const map = await mapDir('/Users/jeremy/Dev/mrsync/_test-src')
		expect(map).toEqual(result)
	})

	test('Gets the appropriate paths', () => {
		const paths = [
			'/Users/jeremy/Dev/mrsync/_test-src/image.png',
			'/Users/jeremy/Dev/mrsync/_test-src/text.txt',
			'/Users/jeremy/Dev/mrsync/_test-src/second-dir/second.txt',
			'/Users/jeremy/Dev/mrsync/_test-src/sub-dir/nested.js',
			'/Users/jeremy/Dev/mrsync/_test-src/sub-dir/sub-sub-dir/deep.txt'
		]
		expect(getPaths(result)).toEqual(paths)
	})

	test('Gets array of stats', async () => {
		const paths = [
			'/Users/jeremy/Dev/mrsync/_test-src/image.png',
			'/Users/jeremy/Dev/mrsync/_test-src/text.txt',
			'/Users/jeremy/Dev/mrsync/_test-src/second-dir/second.txt',
			'/Users/jeremy/Dev/mrsync/_test-src/sub-dir/nested.js',
			'/Users/jeremy/Dev/mrsync/_test-src/sub-dir/sub-sub-dir/deep.txt'
		]

		const stats = [
			{ name: '/Users/jeremy/Dev/mrsync/_test-src/image.png', modified: 1545318968406.2852, size: 114586 },
			{ name: '/Users/jeremy/Dev/mrsync/_test-src/text.txt', modified: 1545273817297.3845, size: 19 },
			{ name: '/Users/jeremy/Dev/mrsync/_test-src/second-dir/second.txt', modified: 1545273817297.3845, size: 19 },
			{ name: '/Users/jeremy/Dev/mrsync/_test-src/sub-dir/nested.js', modified: 1545273859259.8416, size: 26 },
			{ name: '/Users/jeremy/Dev/mrsync/_test-src/sub-dir/sub-sub-dir/deep.txt', modified: 1545273817297.3845, size: 19 }
		]
		expect(await getStats(paths)).toEqual(stats)
	})
})