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

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); evaluate(); return; }
  if (e.key === 'Backspace') { display.value = display.value.slice(0, -1); return; }
  if (e.key === 'Escape') { display.value = ''; return; }
  const allowed = '0123456789.+-*/()';
  if (allowed.includes(e.key)) { display.value += e.key; }
});
