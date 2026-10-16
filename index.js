const express = require ('express');

const app = express();

const users = require ('./users')

const vendas = require ('./vendas.json')

const estoque = require ('./estoque.json')

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

app.post("/aplicacoes", (req, res) => {
  const produto = req.body;

  console.log(produto);

  res.json({
      mensagem: "Produto recebido com sucesso!",
      produto: produto
  });
})

app.get("/estoque/:id", (req, res) => {
  const codigo = req.params.id

  const produto = estoque.estoque.find( 
    produto => produto.codigoProduto == codigo 
  ); 
  
  if (produto) { 
    return res.json({ 
      mensagem: "Produto encontrado com sucesso!", produto: produto 
    }); 
  } 
  return res.status(404).json({ 
    mensagem: "O produto especificado não está no estoque."
  });
})

app.get('/estoque', (req,res) => {
  const produtos = estoque.estoque

  if (produtos.length === 0) {
    return res.status(200).json({
      mensagem: "O estoque está vazio.",
      totalProdutos: 0,
      produtos: []
    });
  }

  return res.status(200).json({
    mensagem: "Produtos encontrados com sucesso!",
    totalProdutos: produtos.length,
    produtos
  });
})

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})

