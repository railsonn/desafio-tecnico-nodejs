const functionVencimento = (data, conta) => {
    const valorOriginal = Number(conta);

    if (!Number.isFinite(valorOriginal)) {
        throw new Error("O valor da conta é inválido.");
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataVencimento = new Date(`${data}T00:00:00`);

    const diferenca = hoje - dataVencimento;

    const diasAtraso = Math.max(
        0,
        Math.floor(diferenca / (1000 * 60 * 60 * 24))
    );

    const taxaDiaria = 2.5;

    const juros = valorOriginal * (taxaDiaria / 100) * diasAtraso;

    const total = valorOriginal + juros;

    return {
        conta: total.toFixed(2),
        valorOriginal: valorOriginal.toFixed(2),
        juros: juros.toFixed(2),
        diasAtraso,
        vencimento: dataVencimento,
        "produto vencido": diasAtraso > 0
    };
};

module.exports = functionVencimento;
