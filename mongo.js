const mongoose = require('mongoose')

const url = process.env['MONGODB_URI']

mongoose.set('strictQuery', false)

mongoose.connect(url)

const userSchema = new mongoose.Schema(
	{
		username: String,
		password: String,
		notes: [
			{
				content: String,
			}
		]
	}
)

const User = mongoose.model('User', userSchema)

const user = new User({
	username: 'kagan',
	password: 'akcelik',
	notes: [
		{
			content: 'this is an important note for kagan'
		},
		{
			content: 'this is another kagan note frfr'
		}
	]
})

user.save().then(result => {
	console.log('saved user to MongoDB')
	mongoose.connection.close()
})