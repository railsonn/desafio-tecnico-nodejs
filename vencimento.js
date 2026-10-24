const vencimento = (data) => {
    const dataAtual = new Date();
    const dataVencimento = new Date(data);
  
    if (dataVencimento < dataAtual) {
      return "Produto vencido";
    } else {
      return "Produto válido";
    }
  };

vencimento("2023-06-15"); // Produto vencido

module.exports = vencimento