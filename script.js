// Calculator logic
const display = document.getElementById('display');
const keys = document.querySelector('.keys');

if (keys) {
  keys.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const val = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === 'clear') { display.value = ''; return; }
    if (action === 'del') { display.value = display.value.slice(0, -1); return; }
    if (action === 'equals') { evaluate(); return; }
    if (val) { display.value += val; }
  });
}

function evaluate(){
  const raw = display.value.replace(/×/g,'*').replace(/÷/g,'/');
  if (!/^[0-9+\-*/(). ]+$/.test(raw)) { alert('Expression contains invalid characters'); return; }
  try {
    const result = Function('"use strict"; return (' + raw + ')')();
    display.value = String(result);
  } catch (err) {
    alert('Invalid expression');
  }
}

// Currency conversion
const exchangeButton = document.getElementById('exchange-button');
const exchangeAmount = document.getElementById('exchange-amount');
const exchangeFrom = document.getElementById('exchange-from');
const exchangeTo = document.getElementById('exchange-to');
const exchangeResult = document.getElementById('exchange-result');

function updateExchangeResult(message) {
  if (exchangeResult) exchangeResult.textContent = message;
}

async function convertCurrency() {
  if (!exchangeAmount || !exchangeFrom || !exchangeTo) return;
  const amount = Number(exchangeAmount.value);
  if (!amount || amount <= 0) {
    updateExchangeResult('Enter a valid amount greater than zero.');
    return;
  }

  const from = exchangeFrom.value;
  const to = exchangeTo.value;
  updateExchangeResult('Fetching latest exchange rate...');

  try {
    const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
    const data = await response.json();
    if (!data || data.success === false) {
      throw new Error('Could not fetch rates');
    }
    const value = Number(data.result).toFixed(4);
    updateExchangeResult(`${amount} ${from} = ${value} ${to}`);
  } catch (err) {
    updateExchangeResult('Unable to fetch exchange rate. Try again later.');
  }
}

if (exchangeButton) {
  exchangeButton.addEventListener('click', convertCurrency);
}

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); evaluate(); return; }
  if (e.key === 'Backspace') { display.value = display.value.slice(0, -1); return; }
  if (e.key === 'Escape') { display.value = ''; return; }
  const allowed = '0123456789.+-*/()';
  if (allowed.includes(e.key)) { display.value += e.key; }
});
