const express = require express();

const app = express();

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    mensagem: "Hello world"
  })
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})