const express = require ('express');

const app = express();

const users = require ('./users')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    mensagem: "Hello world"
  })
})

app.get("/usuarios", (req, res) => {
  res.json(users)
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})