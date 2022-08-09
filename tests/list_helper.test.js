const listHelper = require('../utils/list_helper')

describe('total likes', () => {
	const lisWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	const listWithManyBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234d17f5',
			title: 'Go To ',
			author: 'Edsger',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 8,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234d17f7',
			title: ' Considered Harmful',
			author: 'Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 12,
			__v: 0
		}
	]

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(lisWithOneBlog)
		expect(result).toBe(5)
	})

	test('works with many blogs', () => {
		const result = listHelper.totalLikes(listWithManyBlogs)
		expect(result).toBe(25)
	})


})

describe('most likes', () => {
	const lisWithOneBlog = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		}
	]

	const listWithManyBlogs = [
		{
			_id: '5a422aa71b54a676234d17f8',
			title: 'Go To Statement Considered Harmful',
			author: 'Edsger W. Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 5,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234d17f5',
			title: 'Go To ',
			author: 'Edsger',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 8,
			__v: 0
		},
		{
			_id: '5a422aa71b54a676234d17f7',
			title: ' Considered Harmful',
			author: 'Dijkstra',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 12,
			__v: 0
		}
	]

	test('works with one blog', () => {
		const result = listHelper.favoriteBlog(lisWithOneBlog)
		expect(result).toBe(5)
	})

	test('works wit many blogs', () => {
		const result = listHelper.favoriteBlog(listWithManyBlogs)
		expect(result).toBe(12)
	})

	test('works with empty array', () => {
		const result = listHelper.favoriteBlog([])
		expect(result).toBe(0)
	})
})
