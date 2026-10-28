const express = require('express');

const app = express();

const pool = require('./database');

const vencimento = require('./vencimento');

const dataVencimento = "2024-06-15"; // Valor de vencimento da conta

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensagem: "Hello world"
  });
});

app.get('/conta', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM contas_pagar');
    
    const contasComVencimento = resultado.rows.map(conta => vencimento(dataVencimento, conta.valor));
    console.log(contasComVencimento);

    res.status(200).json({
        sucesso: true,
        total: contasComVencimento.length,

        contas: contasComVencimento.map(valores => ({
            valorOriginal: valores.valorOriginal,
            juros: valores.juros,
            valorAtualizado: valores.conta,
            diasAtraso: valores.diasAtraso,
            vencimento: valores.vencimento.toISOString().split('T')[0],
            vencida: valores["produto vencido"]
        }))
    });

    // segunda forma de fazer
    
    //res.status(200).json({
    //    sucesso: true,

    //   vencimento: contasComVencimento.map(valores =>
    //        `conta com juros: ${valores.conta} - Vencimento: ${valores.vencimento.toISOString().split("T")[0]}`
    //    ),

    //    total: resultado.rows.length,

    //    contas: resultado.rows.map(conta => ({
    //        conta: conta.valor,
    //        vencimento: conta.vencimento
    //    }))
    //});

  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao consultar o estoque' });
  }
});

app.listen(3050, () => {
  console.log('Servidor rodando na porta 3050');
});