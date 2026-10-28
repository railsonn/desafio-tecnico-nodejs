const functionVencimento = (data) => {
    const dataAtual = new Date();
    const dataVencimento = new Date(data);
  
    if (dataVencimento < dataAtual) {
      return "Produto vencido";
    } else {
      return "Produto válido";
    }
  };


module.exports = functionVencimento("2024-06-15");