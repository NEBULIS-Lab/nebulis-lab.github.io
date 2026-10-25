import {normalizeStatistics, naturalEarthPoint, pagePath} from './visitor-data.js';

const API = 'https://nebulis-visitors-20261025.woodsy-charm-7229.chatgpt.site';
const LIVE_HOSTS = new Set(['nebulis-lab.com', 'www.nebulis-lab.com', 'nebulis-lab.github.io']);
const SVG_NS = 'http://www.w3.org/2000/svg';
let statistics = null;
let unavailable = false;

const footer = document.querySelector('.footer');
const container = footer?.querySelector('.container');
let widget = null;

if (container) {
    footer.classList.add('visitor-footer');
    const template = document.createElement('template');
    template.innerHTML = `
      <section class="footer-visitors" id="global-visitors" aria-labelledby="global-visitors-title">
        <div class="footer-visitors-header">
          <p class="visitor-eyebrow">NEBULIS LAB · WORLDWIDE</p>
          <span class="visitor-period" aria-live="polite">Loading visitor statistics…</span>
        </div>
        <div class="footer-visitors-content">
          <div class="visitor-copy">
            <h2 class="footer-visitors-title" id="global-visitors-title" data-en="Global visitors" data-zh="全球访客">Global visitors</h2>
            <p class="visitor-description" data-en="A shared curiosity, from around the world." data-zh="共同的好奇心，来自世界各地。">A shared curiosity, from around the world.</p>
            <dl class="visitor-stats">
              <div class="visitor-stat"><dt data-en="Page views" data-zh="页面访问次数">Page views</dt><dd class="visitor-total" aria-live="polite">—</dd></div>
              <div class="visitor-stat"><dt data-en="Countries &amp; regions" data-zh="国家和地区">Countries &amp; regions</dt><dd class="visitor-countries">—</dd></div>
            </dl>
          </div>
          <figure class="visitor-map-wrap">
            <svg class="visitor-world-map" viewBox="0 0 720 360" role="img" aria-labelledby="visitor-map-title">
              <title id="visitor-map-title">Visitor country and region distribution / 访客国家和地区分布</title>
              <use class="visitor-land"></use><use class="visitor-borders"></use><g class="visitor-points"></g>
            </svg>
            <figcaption class="visitor-map-caption" data-en="Approximate countries &amp; regions · all time" data-zh="国家和地区大致分布 · 累计统计">Approximate countries &amp; regions · all time</figcaption>
          </figure>
        </div>
      </section>`;
    container.prepend(template.content);
    widget = container.querySelector('#global-visitors');
    const map = new URL('../image/visitor-world.svg', import.meta.url).href;
    widget.querySelector('.visitor-land').setAttribute('href', map + '#visitor-world-land');
    widget.querySelector('.visitor-borders').setAttribute('href', map + '#visitor-world-borders');
}

function render() {
    if (!widget) return;
    const chinese = document.documentElement.lang.startsWith('zh');
    const locale = chinese ? 'zh-CN' : 'en';
    const total = widget.querySelector('.visitor-total');
    const countries = widget.querySelector('.visitor-countries');
    const period = widget.querySelector('.visitor-period');
    const points = widget.querySelector('.visitor-points');
    if (!statistics) {
        total.textContent = countries.textContent = '—';
        points.replaceChildren();
        period.textContent = unavailable
            ? (chinese ? '访问统计暂时不可用' : 'Visitor statistics temporarily unavailable')
            : (chinese ? '正在加载访问统计…' : 'Loading visitor statistics…');
        return;
    }
    const format = new Intl.NumberFormat(locale);
    total.textContent = format.format(statistics.views);
    countries.textContent = format.format(statistics.countries);
    if (statistics.startedAt) {
        const date = new Intl.DateTimeFormat(locale, {year:'numeric', month:'short', day:'numeric', timeZone:'Asia/Shanghai'}).format(new Date(statistics.startedAt));
        period.textContent = chinese ? `自 ${date} 起累计` : `Since ${date}`;
    } else {
        period.textContent = chinese ? '开始记录新的访问' : 'Recording new visits';
    }
    let names;
    try { names = new Intl.DisplayNames([locale], {type:'region'}); } catch { /* ISO codes remain readable. */ }
    const fragment = document.createDocumentFragment();
    const maximum = Math.max(1, ...statistics.locations.map(point => point.views));
    for (const point of statistics.locations) {
        const [x, y] = naturalEarthPoint(point.longitude, point.latitude);
        if (x < 0 || x > 720 || y < 0 || y > 360) continue;
        const radius = 2.6 + 3.1 * Math.sqrt(point.views / maximum);
        const group = document.createElementNS(SVG_NS, 'g');
        group.setAttribute('transform', `translate(${x} ${y})`);
        const title = document.createElementNS(SVG_NS, 'title');
        const country = names?.of(point.country) || point.country;
        title.textContent = `${point.city ? point.city + ', ' : ''}${country} · ${format.format(point.views)} ${chinese ? '次访问' : 'page views'}`;
        group.append(title);
        for (const [className, size] of [['visitor-dot-halo', radius + 4], ['visitor-dot', radius]]) {
            const circle = document.createElementNS(SVG_NS, 'circle');
            circle.setAttribute('class', className);
            circle.setAttribute('r', String(size));
            group.append(circle);
        }
        fragment.append(group);
    }
    points.replaceChildren(fragment);
}

async function timedFetch(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try { return await fetch(url, {...options, signal:controller.signal, credentials:'omit', referrerPolicy:'origin'}); }
    finally { clearTimeout(timer); }
}

async function recordPageView() {
    if (!LIVE_HOSTS.has(location.hostname)) return;
    const path = pagePath(location.href);
    if (!path) return;
    const id = crypto.randomUUID();
    const body = JSON.stringify({id, path});
    // A retry reuses this load's ID; a new load always generates a new ID.
    for (let attempt = 0; attempt < 2; attempt++) {
        try {
            const response = await timedFetch(API + '/api/collect', {method:'POST', headers:{'Content-Type':'text/plain;charset=UTF-8'}, body, keepalive:true});
            if (response.ok || response.status < 500) return;
        } catch { /* A failed statistic must never interrupt the website. */ }
    }
}

async function refreshStatistics() {
    if (!widget) return;
    try {
        const response = await timedFetch(API + '/api/stats', {cache:'no-store'});
        if (!response.ok) throw new Error('Statistics unavailable');
        statistics = normalizeStatistics(await response.json());
        unavailable = false;
    } catch { unavailable = true; statistics = null; }
    render();
}

async function visit() {
    await recordPageView();
    await refreshStatistics();
}

document.addEventListener('languageChanged', () => queueMicrotask(render));
window.addEventListener('pageshow', event => { if (event.persisted) visit(); });
if (document.prerendering) document.addEventListener('prerenderingchange', visit, {once:true});
else visit();
render();
