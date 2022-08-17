const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
	{
		title: 'this is blog 1',
		author: 'author of blog 1',
		url: 'http://localhost:3003/1',
		likes: 20
	},
	{
		title: 'this is blog 2',
		author: 'author of blog 2',
		url: 'http://localhost:3003/2',
		likes: 12
	}
]

const nonExistingId = async () => {
	const blog = new Blog({
		title: 'will remove this soon',
		author: 'removed author',
		url: 'http://localhost:3003/remove',
		likes: 5
	})
	await blog.save()
	await blog.remove()

	return blog.id.toString()
}

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}

module.exports = {
	initialBlogs, nonExistingId, blogsInDb, usersInDb
}