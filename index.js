const express = require ('express');

const app = express();

const users = require ('./users')

const vendas = require ('./vendas.json')

const estoque = require ('./estoque.json')

const Produto = require ("./class-produto")

const pool = require('./database');

const array = []

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

app.post("/estoque/aplicacoes", async (req, res) => {
  const produto = req.body;
  
  console.log(produto)
  try { 
    identify_product = await pool.query(`SELECT * FROM estoque WHERE codigo_produto = ${produto.codigo_produto}`)

    if (identify_product.rows != 0) {
      const estoque = await pool.query(`SELECT estoque FROM estoque WHERE codigo_produto = ${produto.codigo_produto}`)
      console.log(`estoque: ${parseInt(estoque.codigo_produto)}`)

      const aplicacao = await pool.query(`INSERT INTO estoque (codigo_produto, descricao_produto, estoque) 
        VALUES ($1, $2, $3) RETURNING *`, [produto.codigo_produto, produto.descricao_produto, produto.estoque + estoque] );
    } else {
      const aplicacao = await pool.query(`INSERT INTO estoque (codigo_produto, descricao_produto, estoque) 
        VALUES ($1, $2, $3) RETURNING *`, [produto.codigo_produto, produto.descricao_produto, produto.estoque] );
    }

    res.status(201).json({ 
      message: "Produto adicionado ao estoque", produto: aplicacao.rows[0] 
    }); 
  } catch (erro) { 
    console.error(erro); 
    res.status(500).json({ 
      erro: "Erro ao adicionar produto ao estoque" 
    }); 
  }
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

app.get('/estoque', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM estoque');

    res.status(200).json({
      sucesso: true,
      mensagem: 'Produtos encontrados com sucesso!',
      total: resultado.rows.length,
      produtos: resultado.rows
    });

  } catch (error) {
    console.error('Erro ao consultar o estoque:', error);

    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao consultar o estoque.',
      erro: 'Erro interno do servidor.'
    });
  }
});

app.get('/produtos', async (req, res) => {
    try {
      const resultado = await pool.query('SELECT * FROM estoque');

      res.json(resultado.rows);
    } catch (erro) {
      console.error(erro);
      res.status(500).json({ erro: 'Erro ao consultar o estoque' });
    }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})

