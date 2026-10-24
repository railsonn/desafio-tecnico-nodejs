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

// rota para movimentações de entrada 
app.post("/estoque/aplicacoes", async (req, res) => {
  const { codigo_produto, produto, estoque, descricao } = req.body;

  const quantidade = Number(estoque);

  try {
    if (!codigo_produto || !descricao_produto || !Number.isInteger(quantidade) || quantidade <= 0) {
      return res.status(400).json({
        erro: "Dados do produto inválidos"
      });
    }

    let resultado = await pool.query(
      `UPDATE estoque SET estoque = estoque + $1 WHERE codigo_produto = $2
       RETURNING *`,
      [quantidade, codigo_produto]
    );

    if (resultado.rows.length === 0) {
      resultado = await pool.query(
        `INSERT INTO estoque (codigo_produto, produto, estoque, descricao) VALUES ($1, $2, $3)
         RETURNING *`,
        [codigo_produto, descricao_produto, quantidade]
      );
    }

    return res.status(200).json({
      sucesso: true,
      mensagem: "Estoque atualizado com sucesso!",
      produto: resultado.rows[0]
    });

  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao adicionar produto ao estoque"
    });
  }
});

// rota para movimentações de saída 
app.delete("/estoque/aplicacoes/:id", async (req, res) => {
  const codigo = req.params.id;

  try {
    const resultado = await pool.query(
      `DELETE FROM estoque WHERE codigo_produto = $1 RETURNING *`,
      [codigo]
    );

    console.log(resultado.rows)
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: 'Produto não encontrado.'
      });
    }

    res.status(200).json({
      sucesso: true,
      mensagem: 'Produto removido do estoque com sucesso!',
      produto: resultado.rows[0]
    });

  } catch (erro) {
    console.error(erro);
    res.status(500).json({
      erro: "Erro ao remover produto do estoque"
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
      produtos: resultado.rows.map(produto => ({
        codigo_produto: produto.codigo_produto,
        descricao_produto: produto.descricao_produto,
        estoque: produto.estoque
      }))
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

