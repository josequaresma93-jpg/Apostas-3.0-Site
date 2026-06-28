function factorial(n) {
  if (n <= 1) return 1;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
function poisson(k, lambda) {
  return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}
function pct(v) { return (v * 100).toFixed(1) + '%'; }
function oddJusta(p) { return p > 0 ? (1 / p).toFixed(2) : '-'; }
function ev(prob, odd) { return (prob * odd) - 1; }
function kelly(prob, odd) {
  const b = odd - 1;
  if (b <= 0) return 0;
  return Math.max(0, ((b * prob) - (1 - prob)) / b);
}
function money(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

function analyze() {
  const home = document.getElementById('homeTeam').value || 'Mandante';
  const away = document.getElementById('awayTeam').value || 'Visitante';
  const hxg = parseFloat(document.getElementById('homeXg').value) || 0;
  const axg = parseFloat(document.getElementById('awayXg').value) || 0;
  const oddOver25 = parseFloat(document.getElementById('oddOver25').value) || 0;
  const oddBtts = parseFloat(document.getElementById('oddBtts').value) || 0;
  const bankroll = parseFloat(document.getElementById('bankroll').value) || 0;
  const fraction = parseFloat(document.getElementById('kellyFraction').value) || 0.25;

  let pHome = 0, pDraw = 0, pAway = 0, pOver25 = 0, pBtts = 0;
  const scores = [];

  for (let h = 0; h <= 6; h++) {
    for (let a = 0; a <= 6; a++) {
      const p = poisson(h, hxg) * poisson(a, axg);
      if (h > a) pHome += p;
      if (h === a) pDraw += p;
      if (h < a) pAway += p;
      if (h + a > 2.5) pOver25 += p;
      if (h > 0 && a > 0) pBtts += p;
      scores.push({ score: `${h} x ${a}`, p });
    }
  }

  const markets = [
    { name: 'Over 2.5 gols', prob: pOver25, odd: oddOver25 },
    { name: 'Ambas marcam — Sim', prob: pBtts, odd: oddBtts }
  ].map(m => {
    const marketEv = ev(m.prob, m.odd);
    const stake = bankroll * kelly(m.prob, m.odd) * fraction;
    return { ...m, marketEv, stake };
  });

  const best = [...markets].sort((a,b) => b.marketEv - a.marketEv)[0];

  document.getElementById('results').classList.remove('hidden');
  document.getElementById('matchTitle').innerText = `${home} x ${away}`;
  document.getElementById('pHome').innerText = pct(pHome);
  document.getElementById('pDraw').innerText = pct(pDraw);
  document.getElementById('pAway').innerText = pct(pAway);
  document.getElementById('pOver25').innerText = pct(pOver25);
  document.getElementById('pBtts').innerText = pct(pBtts);
  document.getElementById('avgGoals').innerText = (hxg + axg).toFixed(2);

  const rec = document.getElementById('recommendation');
  if (best && best.marketEv > 0) {
    rec.innerHTML = `🟢 Melhor entrada encontrada: <strong>${best.name}</strong><br>EV: <strong>${(best.marketEv*100).toFixed(1)}%</strong> | Stake sugerida: <strong>${money(best.stake)}</strong>`;
  } else {
    rec.innerHTML = '🟡 Nenhuma entrada clara com valor positivo nos mercados preenchidos. Melhor esperar odds melhores.';
  }

  document.getElementById('marketTable').innerHTML = markets.map(m => `
    <tr>
      <td>${m.name}</td>
      <td>${pct(m.prob)}</td>
      <td>${oddJusta(m.prob)}</td>
      <td>${m.odd.toFixed(2)}</td>
      <td class="${m.marketEv >= 0 ? 'positive' : 'negative'}">${(m.marketEv*100).toFixed(1)}%</td>
      <td>${money(m.stake)}</td>
    </tr>
  `).join('');

  const topScores = scores.sort((a,b) => b.p - a.p).slice(0, 10);
  document.getElementById('scoreGrid').innerHTML = topScores.map(s => `
    <div class="score"><strong>${s.score}</strong><span>${pct(s.p)}</span></div>
  `).join('');
}

document.getElementById('analyzeBtn').addEventListener('click', analyze);
document.getElementById('clearBtn').addEventListener('click', () => location.reload());
document.getElementById('exampleBtn').addEventListener('click', () => {
  document.getElementById('homeTeam').value = 'América MG';
  document.getElementById('awayTeam').value = 'Criciúma';
  document.getElementById('homeXg').value = 1.62;
  document.getElementById('awayXg').value = 0.94;
  document.getElementById('oddOver25').value = 2.15;
  document.getElementById('oddBtts').value = 2.05;
  analyze();
});
