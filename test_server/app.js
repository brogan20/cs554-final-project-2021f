const express = require("express"),
      app = express()

app.use(express.json());

app.get('/', async (req, res) => {
  return res.json({ msg: 'success!', desc: 'the page works!!' })
})

app.get('/a', async (req, res) => {
  return res.json({ msg: 'Page A', desc: 'You can navigate to page A' })
})

app.get('/b', async (req, res) => {
  return res.json({ msg: 'Page B', desc: 'You can navigate to page B' })
})


app.get('/a/b', async (req, res) => {
  return res.json({ msg: 'Page AB', desc: 'subroutes also work!' })
})

app.listen(4000, () => {
  console.log("Server running at http://localhost:4000");
})
