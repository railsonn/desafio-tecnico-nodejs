const express = require ('express');

const app = express();

const users = require ('./users')

const vendas = require ('./vendas.json')

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    mensagem: "Hello world"
  })
})

app.get("/usuarios", (req, res) => {
  res.json(users[1].nome)
})

app.get("/vendas", (req, res) => {

  const vendedores = {};

  vendas.vendas.forEach(venda => {

    let comissao = 0;

    if (venda.valor > 100 && venda.valor < 500) {
      comissao = (venda.valor * 1) / 100;

    } else if (venda.valor >= 500) {
      comissao = (venda.valor * 5) / 100;
    }

    if (vendedores[venda.vendedor]) {
      vendedores[venda.vendedor] += comissao;
    } else {
      vendedores[venda.vendedor] = comissao;
    }

  });

  res.json(vendedores);
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})