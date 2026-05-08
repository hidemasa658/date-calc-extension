const baseDateEl = document.getElementById('baseDate');
const daysEl = document.getElementById('days');
const resultBox = document.getElementById('resultBox');
const resultDate = document.getElementById('resultDate');
const resultDetail = document.getElementById('resultDetail');
const resultWeekday = document.getElementById('resultWeekday');
const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

function formatISO(d) {
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}

const elapsedBox = document.getElementById('elapsedBox');
const elapsedText = document.getElementById('elapsedText');

function setToday() {
  baseDateEl.value = formatISO(new Date());
  calc();
}

function updateElapsed() {
  const base = baseDateEl.value;
  if (!base) { elapsedBox.classList.add('hidden'); return; }
  const baseD = new Date(base + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - baseD) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) { elapsedBox.classList.add('hidden'); return; }
  const weeks = Math.floor(diffDays / 7);
  const rem = diffDays % 7;
  let text = '今日まで ' + diffDays + '日経過';
  if (weeks > 0) {
    text += '（' + weeks + '週' + (rem > 0 ? rem + '日' : '') + '）';
  }
  elapsedText.textContent = text;
  elapsedBox.classList.remove('hidden');
}

function calc() {
  const base = baseDateEl.value;
  const days = parseInt(daysEl.value);
  if (!base || isNaN(days)) {
    resultBox.classList.add('hidden');
    return;
  }

  const baseD = new Date(base + 'T00:00:00');
  const result = new Date(baseD);
  result.setDate(result.getDate() + days);

  const y = result.getFullYear();
  const m = result.getMonth() + 1;
  const d = result.getDate();
  const wd = weekdays[result.getDay()];

  resultDate.textContent = m + '月' + d + '日（' + wd + '）';

  const diffMs = result - baseD;
  const diffDays = Math.round(diffMs / (1000*60*60*24));
  const direction = diffDays >= 0 ? '後' : '前';
  const absDays = Math.abs(diffDays);
  const weeks = Math.floor(absDays / 7);
  const remainDays = absDays % 7;
  let detail = y + '年' + m + '月' + d + '日 — ' + absDays + '日' + direction;
  if (weeks > 0) {
    detail += '（' + weeks + '週' + (remainDays > 0 ? remainDays + '日' : '') + '）';
  }
  resultDetail.textContent = detail;

  const dayOfWeek = result.getDay();
  resultWeekday.textContent = wd + '曜日';
  resultWeekday.className = 'result-weekday ' + (dayOfWeek === 0 ? 'wd-sun' : dayOfWeek === 6 ? 'wd-sat' : 'wd-week');

  resultBox.classList.remove('hidden');
}

document.getElementById('todayBtn').addEventListener('click', setToday);
baseDateEl.addEventListener('input', () => { updateElapsed(); calc(); });
daysEl.addEventListener('input', calc);

document.getElementById('copyBtn').addEventListener('click', () => {
  const text = resultDate.textContent + ' ' + resultDetail.textContent;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('copyBtn').textContent = '✓ コピー済み';
    setTimeout(() => { document.getElementById('copyBtn').textContent = '📋 コピー'; }, 1200);
  });
});

document.getElementById('memoToggle').addEventListener('click', () => {
  const box = document.getElementById('memoBox');
  const btn = document.getElementById('memoToggle');
  box.classList.toggle('open');
  btn.textContent = box.classList.contains('open') ? '📋 爪白癬 治療メモ ▲' : '📋 爪白癬 治療メモ ▼';
});

setToday();
daysEl.focus();
