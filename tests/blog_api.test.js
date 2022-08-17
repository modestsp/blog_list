const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')
const Blog =  require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})

	for(let blog of helper.initialBlogs) {
		let blogObject = new Blog(blog)
		await blogObject.save()
	}
})

beforeEach(async () => {
	await User.deleteMany({})

	const passwordHash = await bcrypt.hash('sekret', 10)
	const user =  new User ({ username: 'rootUser', passwordHash, name: 'root Name' })

	await user.save()
})
describe.skip('when there is initially some blogs saved', () => {

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs')

		expect(response.body).toHaveLength(helper.initialBlogs.length)
	}, 100000)


	test('each blog have the id property', async() => {
		const response = await api.get('/api/blogs')

		response.body.forEach(blog => {
			expect(blog.id).toBeDefined()
		})
	})


})

describe.skip('viewing a specific note', () => {
	test('succeeds with a valid id', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const blogToView = blogsAtStart[0]

		const resultBlog = await api
			.get(`/api/blogs/${blogToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const processedBlogToView = JSON.parse(JSON.stringify(blogToView))

		expect(resultBlog.body).toEqual(processedBlogToView)
	})

	test('fails with statuscode 404 if note does not exist', async () => {
		const validNonexistingId = await helper.nonExistingId()

		console.log(validNonexistingId)

		await api
			.get(`/api/blogs/${validNonexistingId}`)
			.expect(404)
	})

	test('fails with statuscode 400 id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445'

		await api
			.get(`/api/blogs/${invalidId}`)
			.expect(400)
	})

})
// describe('viewing a specific blog', () => {
// 	test('succeds with a valid id', )
// })

describe.skip('addition of a new blog', () => {

	test('a valid blog can be added', async () => {

		const newBlog = {
			title: 'new blog title',
			author: 'New Author',
			url: 'http://localhost:3003/new',
			likes: 20
		}

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

		const titles = blogsAtEnd.map(blog => blog.title)
		expect(titles).toContain(
			'new blog title'
		)
	})

	test('if likes property is missing it return likes 0', async () => {
		const newBlogWithoutLikes = {
			title: 'new blog title without likes',
			author: 'New Author unpopular',
			url: 'http://localhost:3003/likes'
		}

		await api
			.post('/api/blogs')
			.send(newBlogWithoutLikes)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')
		const likes = response.body.map(blog => blog.likes)

		// const lastBlog = response.body[initialBlogs.length + 1]

		expect(likes).toContain(0)
	})

	test('if url and title are missing returns 400 bad request', async () => {
		const newBlogWithMissing = {
			author: 'Author',
			likes: 20
		}

		await api
			.post('/api/blogs')
			.send(newBlogWithMissing)
			.expect(400)
	})
})

describe.skip('deletion of a note', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

		const titles = blogsAtEnd.map(blog => blog.title)

		expect(titles).not.toContain(blogToDelete.title)
	})

})

describe.skip('updating an existing blog', () => {
	test('update likes from a blog', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]

		const newBlog = { ...blogToUpdate, likes: 12 }

		const updatedBlog = await Blog.findByIdAndUpdate(blogToUpdate.id, newBlog, { new: true })
		expect(updatedBlog.likes).not.toBe(blogToUpdate.likes)
	})
})

describe('when there is initially one user in db', () => {

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen'
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
	})
}, 1000000)

describe('addition of a new user', () => {
	test('both username and password are required', async () => {
		const userWithoutPassword = {
			username: 'invalidUser',
			name: 'Test user',
		}

		await api
			.post('/api/users')
			.send(userWithoutPassword)
			.expect(400)
			.expect('Content-Type', /application\/json/)
	})
	test('username and password must be at least 3 characters long', async () => {
		const invalidUser = {
			username: 'validUsername',
			name: 'Valid name',
			password: 'in'
		}

		await api
			.post('/api/users')
			.send(invalidUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)
	})
})
afterAll(() => {
	mongoose.connection.close()
})