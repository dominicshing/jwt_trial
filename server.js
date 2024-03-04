const express = require('express')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const app = express()

app.use(express.json())

const PORT = 3000

const posts = [
  { username: 'Dominic', title: 'Title 1' },
  { username: 'Peter', title: 'Title 2' },
]

app.get('/posts', authenticateToken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name))
})

app.post('/login', (req, res) => {
  // Authenticate the user

  const { username } = req.body

  const user = { name: username }

  const jwt_access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)

  res.json({ jwt_access_token })
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.sendStatus(403)
    }

    req.user = user

    next()
  })
}

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`)
})
