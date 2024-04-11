const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('pusho', function (req, res) { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :pusho'))

let users = [
	{
		id: 1,
		username: 'kagan',
		password: 'akcelik',
		notes: [
			{
				id: 1,
				content: 'this is an important note for kagan'
			},
			{
				id: 2,
				content: 'this is another kagan note frfr'
			}
		]
	},
	{
		id: 2,
		username: 'user',
		password: 'pass',
		notes: [
			{
				id: 1,
				content: 'this is an important note for user'
			}
		]
	},
]

app.use(express.json())

const unknownEndpoint = (request, response) => {
	response.status(404).end({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
	response.send('<h1>todo 0.1 backserver</h1>')
})

app.get('/api/users', (request, response) => {
	response.json(users)
})

app.get('/api/users/:user', (request, response) => {
	const username = request.params.user
	const user = users.find(u => u.username === username)

	if (user) {
		response.json(user)
	} else {
	response.status(404).end()
	}
})

app.post('/api/users/:user', (request, response) => {
	const body = request.body

	if (!body.content) {
		return response.status(400).json({
			error: 'content missing'
		})
	}
	
	const username = request.params.user
	
	const note = {
		content: body.content,
		id: users.find(u => u.username === username).notes.length + 1
	}
	
	users.find(u => u.username === username).notes = users.find(u => u.username === username).notes.concat(note)
	// console.log(users)
	
	response.json(note)
})

app.delete('/api/users/:user/:id', (request, response) => {
	const id = Number(request.params.id)
	const username = request.params.user

	users.find(u => u.username === username).notes = users.find(u => u.username === username).notes.filter(n => n.id !== id)

	response.status(204).end()
})

app.post('/api/users', (request, response) => {
	const body = request.body

	if (!body.username || !body.password) {
		return response.status(400).json({
			error: 'content missing'
		})
	}

	const username = body.username
	const password = body.password

	const newUser = {
		id: users.length + 1,
		username: username,
		password: password,
		notes: []
	}

	users = users.concat(newUser)

	response.json(newUser)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})