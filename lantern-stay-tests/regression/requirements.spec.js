// Requirements regression: every AC of LS-106/107/108 against both booking pages.
// Records PASS / GAP / N/A with what the page actually showed; never fails the run.
const { test } = require('@playwright/test');
const { pathToFileURL } = require('url');
const fs = require('fs');
const path = require('path');
const R = path.join(__dirname, '../..') + '/';
const OUT = path.join(__dirname, 'results.jsonl');

const APPS = {
  demo: {
    url: pathToFileURL(R + 'lantern-stay-tests/app/index.html').href,
    guests: (p) => p.getByLabel('Guests', { exact: true }),
    room: (p) => p.getByLabel('Room type'),
    submit: (p) => p.getByRole('button', { name: 'Book now' }),
    price: (p) => p.getByTestId('price').textContent(),
    sent: async (p) => (await p.locator('#result').textContent()) === 'Booking request sent!',
  },
  main: {
    url: pathToFileURL(R + 'App/index.html').href,
    guests: (p) => p.getByLabel('Guests'),
    room: (p) => p.getByLabel('Room'),
    submit: (p) => p.getByRole('button', { name: 'Check price' }),
    price: (p) => p.locator('#result').textContent(),
    sent: async (p) => (await p.locator('#result').textContent()) !== '',
  },
};

// All messages the user can see: page error text plus native browser validation bubbles
async function messages(p) {
  return p.evaluate(() => {
    const page = [...document.querySelectorAll('.error, #error')].map(e => e.textContent).filter(Boolean);
    const native = [...document.querySelectorAll('input:invalid')].map(e => 'native: ' + e.validationMessage);
    return [...page, ...native].join(' | ');
  });
}
async function typeGuests(p, a, v) {
  const f = a.guests(p);
  await f.click(); await f.press('ControlOrMeta+a'); await f.press('Backspace');
  if (v) await p.keyboard.type(v);
}
async function setDates(p, ci, co) {
  if (ci !== undefined) await p.getByLabel('Check-in').fill(ci);
  if (co !== undefined) await p.getByLabel('Check-out').fill(co);
}
async function validRest(p, a) { // valid dates + room, so only the field under test can block
  await setDates(p, '2026-11-10', '2026-11-12');
  await a.room(p).selectOption('standard');
}
const has = (s, msg) => s.replace(/\.(\s|$)/g, '$1').includes(msg);

const CHECKS = [
  // ---------- LS-106 Guests ----------
  ...['1', '6'].map((v, i) => ({ id: `LS-106 AC${i + 1}`, what: `enter ${v} → accepted, no error`, run: async (p, a) => {
    await validRest(p, a); await typeGuests(p, a, v); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: m === '' && s, obs: `messages="${m}" submitted=${s}` };
  } })),
  ...[['0', 3], ['7', 4]].map(([v, n]) => ({ id: `LS-106 AC${n}`, what: `enter ${v} → "Enter 1 to 6 guests", cannot submit`, run: async (p, a) => {
    await validRest(p, a); await typeGuests(p, a, v); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: has(m, 'Enter 1 to 6 guests') && !s, obs: `messages="${m}" submitted=${s}` };
  } })),
  { id: 'LS-106 AC5', what: 'enter 2.5 → "Number of guests must be a whole number", cannot submit', run: async (p, a) => {
    await validRest(p, a); await typeGuests(p, a, '2.5'); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: has(m, 'Number of guests must be a whole number') && !s, obs: `messages="${m}" submitted=${s}` };
  } },
  ...['-1', 'abc', ' '].map((v) => ({ id: 'LS-106 AC6', what: `enter ${JSON.stringify(v)} → "Enter 1 to 6 guests", cannot submit`, run: async (p, a) => {
    await validRest(p, a); await typeGuests(p, a, v); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: has(m, 'Enter 1 to 6 guests') && !s, obs: `typed=${JSON.stringify(await a.guests(p).inputValue())} messages="${m}" submitted=${s}` };
  } })),
  { id: 'LS-106 AC7', what: 'empty guests + Submit → "Number of guests is required" and field highlighted', run: async (p, a) => {
    await validRest(p, a); await typeGuests(p, a, ''); await a.submit(p).click();
    const m = await messages(p);
    const hl = await a.guests(p).evaluate(e => ({ ariaInvalid: e.getAttribute('aria-invalid'), border: getComputedStyle(e).borderColor, outline: getComputedStyle(e).outlineStyle }));
    const highlighted = hl.ariaInvalid === 'true' || !/118, 118, 118|0, 0, 0|133, 133, 133/.test(hl.border);
    return { ok: has(m, 'Number of guests is required') && highlighted, obs: `messages="${m}" highlight=${JSON.stringify(hl)}` };
  } },
  { id: 'LS-106 AC8', what: 'server rejects guests = 9 and saves nothing', na: 'No booking server exists in the repo; the page never sends a booking anywhere.' },
  { id: 'LS-106 AC9', what: 'errors shown in Vietnamese when the form is in Vietnamese', run: async (p) => {
    const lang = await p.evaluate(() => ({ htmlLang: document.documentElement.lang, switcher: !!document.querySelector('[lang="vi"], [hreflang="vi"], select[name*=lang i], [data-lang]') }));
    return { ok: lang.switcher, obs: `html lang="${lang.htmlLang}", Vietnamese switch present=${lang.switcher}` };
  } },
  { id: 'LS-106 AC10', what: 'error disappears when value becomes valid, without reload', run: async (p, a) => {
    await validRest(p, a); await typeGuests(p, a, '7'); await a.submit(p).click();
    const before = await messages(p);
    await typeGuests(p, a, '3');
    const after = await messages(p);
    return { ok: before !== '' && after === '', obs: `after 7: "${before}" → after typing 3 (no submit): "${after}"` };
  } },
  { id: 'LS-106 scope', what: 'error text linked to field with aria-describedby', run: async (p, a) => {
    const d = await a.guests(p).getAttribute('aria-describedby');
    return { ok: !!d, obs: `aria-describedby=${JSON.stringify(d)}` };
  } },

  // ---------- LS-107 Dates (today = 02/11/2026 VN) ----------
  { id: 'LS-107 AC1', what: 'check-in today (02/11) accepted', run: async (p, a) => {
    await setDates(p, '2026-11-02', '2026-11-04'); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: m === '' && s, obs: `messages="${m}" submitted=${s}` };
  } },
  { id: 'LS-107 AC2', what: 'check-in yesterday → "Check-in must be today or later", picker blocks past', run: async (p, a) => {
    const min = await p.getByLabel('Check-in').getAttribute('min');
    await setDates(p, '2026-11-01', '2026-11-04'); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: has(m, 'Check-in must be today or later') && !s && min === '2026-11-02', obs: `messages="${m}" submitted=${s} picker min=${JSON.stringify(min)}` };
  } },
  { id: 'LS-107 AC3', what: '10/11 → 11/11 accepted, nights = 1', run: async (p, a) => {
    await setDates(p, '2026-11-10', '2026-11-11'); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const m = await messages(p), pr = await a.price(p);
    return { ok: m === '' && /^1 night/.test(pr), obs: `messages="${m}" price="${pr}"` };
  } },
  ...[['2026-11-10', 4, 'same day'], ['2026-11-08', 5, 'earlier']].map(([co, n, t]) => ({ id: `LS-107 AC${n}`, what: `check-out ${t} → "Check-out must be after check-in", cannot submit`, run: async (p, a) => {
    await setDates(p, '2026-11-10', co); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: has(m, 'Check-out must be after check-in') && !s, obs: `messages="${m}" submitted=${s}` };
  } })),
  { id: 'LS-107 AC6', what: 'changing check-in 10/11 → 15/11 clears check-out', run: async (p) => {
    await setDates(p, '2026-11-10', '2026-11-12'); await setDates(p, '2026-11-15');
    const co = await p.getByLabel('Check-out').inputValue();
    return { ok: co === '', obs: `check-out after change = ${JSON.stringify(co)}` };
  } },
  { id: 'LS-107 AC7', what: 'guest in New York (20:00 01/11) picks 01/11 → rejected (Vietnam "today")', tz: 'America/New_York', run: async (p, a) => {
    await setDates(p, '2026-11-01', '2026-11-03'); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const m = await messages(p), s = await a.sent(p);
    return { ok: has(m, 'Check-in must be today or later') && !s, obs: `messages="${m}" submitted=${s}` };
  } },
  { id: 'LS-107 AC8', what: 'form left open past midnight → server rejects stale check-in', na: 'Server-side rule; no booking server exists in the repo.' },
  ...[['', '', 'both empty'], ['2026-11-10', '', 'check-out empty']].map(([ci, co, t]) => ({ id: 'LS-107 AC9', what: `${t} + Submit → "Choose check-in and check-out dates"`, run: async (p, a) => {
    await setDates(p, ci, co); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const m = await messages(p);
    return { ok: has(m, 'Choose check-in and check-out dates'), obs: `messages="${m}"` };
  } })),
  { id: 'LS-107 AC10', what: 'server rejects bad dates and saves nothing', na: 'Server-side rule; no booking server exists in the repo.' },
  { id: 'LS-107 AC11', what: '30/01/2027 → 02/02/2027 gives 3 nights', run: async (p, a) => {
    await setDates(p, '2027-01-30', '2027-02-02'); await a.room(p).selectOption('standard'); await typeGuests(p, a, '2'); await a.submit(p).click();
    const pr = await a.price(p);
    return { ok: /^3 night/.test(pr), obs: `price="${pr}"` };
  } },

  // ---------- LS-108 Price (live, no submit) ----------
  ...[
    ['AC1', '2026-11-10', '2026-11-11', 'standard', '1 night × 600,000 ₫ = 600,000 ₫'],
    ['AC2', '2026-11-10', '2026-11-13', 'standard', '3 nights × 600,000 ₫ = 1,800,000 ₫'],
    ['AC3', '2026-11-10', '2026-11-12', 'deluxe', '2 nights × 900,000 ₫ = 1,800,000 ₫'],
    ['AC4', '2026-11-10', '2026-11-17', 'deluxe', '7 nights × 900,000 ₫ = 6,300,000 ₫'],
    ['AC5', '2027-01-30', '2027-02-02', 'deluxe', '3 nights × 900,000 ₫ = 2,700,000 ₫'],
  ].map(([ac, ci, co, room, exp]) => ({ id: `LS-108 ${ac}`, what: `shows "${exp}" as soon as dates + room are picked`, run: async (p, a) => {
    await setDates(p, ci, co); await a.room(p).selectOption(room);
    const live = await a.price(p);
    await a.submit(p).click();
    const afterClick = await a.price(p);
    return { ok: live === exp, obs: `before clicking: "${live}" | after clicking ${'submit'}: "${afterClick}"` };
  } })),
  { id: 'LS-108 AC6', what: 'switch Standard → Deluxe updates price to 2,700,000 ₫ without reload', run: async (p, a) => {
    await setDates(p, '2026-11-10', '2026-11-13'); await a.room(p).selectOption('standard'); await a.submit(p).click();
    await p.evaluate(() => { window.__noReload = true; });
    await a.room(p).selectOption('deluxe');
    const pr = await a.price(p), same = await p.evaluate(() => window.__noReload === true);
    return { ok: pr.includes('2,700,000 ₫') && same, obs: `price after switch (no click)="${pr}" noReload=${same}` };
  } },
  { id: 'LS-108 AC7', what: 'changing guests 2 → 4 keeps the price', run: async (p, a) => {
    await typeGuests(p, a, '2'); await setDates(p, '2026-11-10', '2026-11-13'); await a.room(p).selectOption('standard'); await a.submit(p).click();
    const before = await a.price(p);
    await typeGuests(p, a, '4'); await a.submit(p).click();
    const after = await a.price(p);
    return { ok: before !== '' && before === after, obs: `2 guests: "${before}" | 4 guests: "${after}"` };
  } },
  ...[[undefined, undefined, 'standard', 'dates missing'], ['2026-11-10', '2026-11-08', 'standard', 'dates invalid'], ['2026-11-10', '2026-11-12', null, 'no room chosen']].map(([ci, co, room, t]) => ({ id: 'LS-108 AC8', what: `${t} → only "Choose dates and room type to see the price"`, run: async (p, a) => {
    await setDates(p, ci, co);
    if (room) await a.room(p).selectOption(room);
    const pr = await a.price(p);
    const roomNote = room === null ? ` (room select value="${await a.room(p).inputValue()}")` : '';
    return { ok: pr === 'Choose dates and room type to see the price', obs: `price area="${pr}"${roomNote}` };
  } })),
  { id: 'LS-108 AC9', what: 'server recalculates a tampered price', na: 'Server-side rule; no booking server exists in the repo.' },
  { id: 'LS-108 AC10', what: 'whole VND, thousands separators, ₫ symbol', run: async (p, a) => {
    await setDates(p, '2026-11-10', '2026-11-17'); await a.room(p).selectOption('deluxe'); await a.submit(p).click();
    const pr = await a.price(p);
    return { ok: /\d{1,3}(,\d{3})+ ₫$/.test(pr), obs: `price="${pr}"` };
  } },
  { id: 'LS-108 scope', what: 'nightly rates kept on the server, not written into the page', run: async (p) => {
    const inPage = await p.evaluate(() => /600000|600,000/.test(document.documentElement.innerHTML));
    return { ok: !inPage, obs: `rates hard-coded in page HTML/script=${inPage}` };
  } },
];

for (const [appName, a] of Object.entries(APPS)) {
  for (const c of CHECKS) {
    test(`${appName} ${c.id} ${c.what}`, async ({ browser }) => {
      const row = { app: appName, id: c.id, what: c.what };
      if (c.na) { fs.appendFileSync(OUT, JSON.stringify({ ...row, verdict: 'N/A', obs: c.na }) + '\n'); return; }
      const ctx = await browser.newContext({ timezoneId: c.tz || 'Asia/Ho_Chi_Minh', locale: 'en-GB' });
      const p = await ctx.newPage();
      // 02/11/2026 09:00 in Vietnam = 01/11/2026 20:00 in New York
      await p.clock.setFixedTime(new Date('2026-11-02T09:00:00+07:00'));
      await p.goto(a.url);
      try {
        const { ok, obs } = await c.run(p, a);
        fs.appendFileSync(OUT, JSON.stringify({ ...row, verdict: ok ? 'PASS' : 'GAP', obs }) + '\n');
      } catch (e) {
        fs.appendFileSync(OUT, JSON.stringify({ ...row, verdict: 'ERROR', obs: e.message.split('\n')[0] }) + '\n');
      }
      await ctx.close();
    });
  }
}
