const apiUrl = 'https://mindicador.cl/api';

async function fetchExchangeRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
}

function convertCurrency() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const resultElement = document.getElementById('result');
    const errorElement = document.getElementById('error');

    fetchExchangeRates()
        .then(data => {
            const exchangeRate = data[fromCurrency].valor / data[toCurrency].valor;
            const result = amount * exchangeRate;
            resultElement.innerText = `Resultado: ${result.toFixed(2)} ${toCurrency.toUpperCase()}`;
            errorElement.innerText = '';
            createChart(data);
        })
        .catch(error => {
            errorElement.innerText = `Error: ${error.message}`;
        });
}

function createChart(data) {
    const chartData = Object.keys(data).map(currency => {
        return {
            x: currency,
            y: data[currency].valor,
        };
    });

    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.map(item => item.x),
            datasets: [{
                label: 'Valor',
                data: chartData.map(item => item.y),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}