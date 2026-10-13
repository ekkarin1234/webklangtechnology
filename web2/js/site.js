(function () {
  const app = document.getElementById('app');
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const lines = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean);

  const FB_SVG = n => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FFFFFF" d="M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.1v3h2.5V21h2.9z"></path></svg>`;
  const LINE_SVG = n => `<svg width="${n}" height="${n}" viewBox="0 0 24 24" aria-hidden="true"><path fill="#FFFFFF" d="M12 3.5c-5 0-9 3.2-9 7.2 0 3.6 3.2 6.6 7.5 7.1.3.1.7.2.8.5.1.2.1.6 0 .9l-.1.8c0 .2-.2.9.8.5s5.4-3.2 7.4-5.4c1.4-1.5 2-3 2-4.4 0-4-4-7.2-9-7.2z"></path><text x="12" y="12.6" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="5" fill="#06C755">LINE</text></svg>`;

  const state = { page: 'home', quote: {}, sent: false, refNo: '', c: window.KTSCMS.DEFAULTS };

  // ---------- helpers ----------
  function catalogOf(c) {
    const out = [];
    (c.boats.items || []).forEach(b => out.push({ id: b.id, name: `${c.boats.name || ''} รุ่น ${b.m}`, sub: b.sub, unit: c.boats.unit, img: b.img }));
    if (c.pump.name) out.push({ id: 'pump', name: c.pump.name, sub: c.pump.quoteSub, unit: c.pump.unit, img: c.pump.img });
    (c.floodwall.items || []).forEach(f => out.push({ id: f.id, name: `${c.floodwall.name || ''} ${f.name}`, sub: `${f.dim} · ${f.kg}`, unit: c.floodwall.unit, img: f.img }));
    return out;
  }
  const quoteItems = () => catalogOf(state.c).filter(x => state.quote[x.id]).map(x => ({ ...x, qty: state.quote[x.id] }));

  function qtyControl(id, unit, variant) {
    const qty = state.quote[id] || 0;
    if (qty > 0) {
      const cls = variant === 'wall' ? 'stepper sm' : variant === 'pump' ? 'stepper lg' : 'stepper';
      return `<div class="${cls}"><button type="button" data-act="dec" data-id="${esc(id)}" aria-label="ลดจำนวน">−</button><span>${qty} ${esc(unit)}</span><button type="button" data-act="inc" data-id="${esc(id)}" aria-label="เพิ่มจำนวน">+</button></div>`;
    }
    if (variant === 'wall') return `<button type="button" class="btn-outline" data-act="inc" data-id="${esc(id)}">+ ใบเสนอราคา</button>`;
    const pad = variant === 'pump' ? 'padding:12px 22px' : 'padding:10px 18px';
    return `<button type="button" class="btn-blue" style="${pad};font-size:15px" data-act="inc" data-id="${esc(id)}">+ เพิ่มในใบเสนอราคา</button>`;
  }

  // ---------- partials ----------
  function topbar(c) {
    return `<div class="topbar"><div class="wrap">
      <span class="topbar-text">${esc(c.topbar.text)}</span>
      <div class="topbar-social">
        <a href="${esc(c.social.facebookUrl)}" target="_blank" rel="noopener" aria-label="Facebook"><span class="ico-fb">${FB_SVG(18)}</span>Facebook</a>
        <span class="topbar-sep"></span>
        <a href="${esc(c.social.lineUrl)}" target="_blank" rel="noopener" aria-label="LINE Official Account"><span class="ico-line">${LINE_SVG(22)}</span>LINE OA</a>
      </div>
    </div></div>`;
  }

  function header(c) {
    return `<header class="header"><div class="wrap">
      <button class="logo-btn" data-act="home" aria-label="หน้าแรก"><img src="${esc(c.logo)}" alt="${esc(c.contact.company)}"></button>
      <nav class="nav">
        <button data-act="home">${esc(c.nav.home)}</button>
        <button data-act="nav" data-to="about">${esc(c.nav.about)}</button>
        <button data-act="nav" data-to="products">${esc(c.nav.products)}</button>
        <button data-act="nav" data-to="contact">${esc(c.nav.contact)}</button>
      </nav>
      <div class="header-actions">
        ${state.page === 'quote' ? `<button class="btn-back" data-act="home">← กลับหน้าสินค้า</button>` : ''}
        ${state.page === 'article' ? `<button class="btn-back" data-act="home">← กลับหน้าแรก</button>` : ''}
        <button class="btn-quote" data-act="quote">${esc(c.nav.quote)} <span class="count-pill" data-slot="count">${quoteItems().length}</span></button>
      </div>
    </div></header>`;
  }

  // The leading number of a category tag follows its position on the page, so reordering sections doesn't need a content edit.
  function catHead(sec, n) {
    const tag = n ? String(sec.tag || '').replace(/^\d+/, String(n).padStart(2, '0')) : sec.tag;
    return `<div class="cat-head"><div><span class="cat-tag">${esc(tag)}</span><h3>${esc(sec.title)}</h3></div><span class="cat-meta">${esc(sec.meta)}</span></div>`;
  }

  function home(c) {
    const targets = ['floodwall', 'pump', 'boats'];
    const pillars = (c.pillars || []).map((p, i) => `
      <button class="pillar" data-act="nav" data-to="${targets[i] || 'products'}">
        <div class="pillar-img"><img src="${esc(p.img)}" alt="${esc(p.label)}"></div>
        <div class="pillar-body">
          <div class="skew-tag"><span class="bar"></span><span class="lbl"><span>${esc(p.label)}</span></span></div>
          <p>${esc(p.text)}</p>
        </div>
      </button>`).join('');

    const steps = ((c.about && c.about.steps) || []).map((s, i) => `
      <div class="step"><span class="step-n">${String(i + 1).padStart(2, '0')}</span><span class="step-t"><b>${esc(s.title)}</b><span>${esc(s.text)}</span></span></div>`).join('');

    const boats = (c.boats.items || []).map(b => {
      const title = `${c.boats.name || ''} รุ่น ${b.m}`;
      return `<article class="boat">
        <div class="boat-media">
          <img src="${esc(b.img)}" alt="${esc(title)}" data-zoom="${esc(title + ' · ' + (b.sub || ''))}" loading="lazy">
          <div class="boat-model"><span class="bar"></span><span class="lbl"><span>${esc(b.m)}</span></span></div>
          ${b.mold === true || b.mold === 'yes' ? `<span class="mold">${esc(c.boats.moldLabel)}</span>`
            : b.mold === 'wait' ? `<span class="mold wait">${esc(c.boats.moldWaitLabel || 'รอแม่พิมพ์ขึ้นรูป')}</span>` : ''}
        </div>
        <div class="boat-body">
          <div class="boat-title">
            ${b.hasEng ? `<span class="badge-eng">${esc(c.boats.engLabel)}</span>` : `<span class="badge-hull">${esc(c.boats.hullLabel)}</span>`}
            <h4>${esc(title)}</h4>
          </div>
          <div class="dims">
            <div><small>ความยาว</small><b>≥ ${esc(b.len)} ม.</b></div>
            <div><small>ความกว้าง</small><b>≥ ${esc(b.w)} ม.</b></div>
            <div><small>ความสูงขอบนอก</small><b>≥ ${esc(b.h)} ม.</b></div>
          </div>
          <div class="boat-lines"><span>${esc(b.line1)}</span><span>${esc(b.line2)}</span><span>${esc(b.line3)}</span></div>
          <div class="boat-foot" data-slot="qty" data-id="${esc(b.id)}" data-unit="${esc(c.boats.unit)}" data-variant="boat">${qtyControl(b.id, c.boats.unit, 'boat')}</div>
        </div>
      </article>`;
    }).join('');

    const walls = c.floodwall.items || [];
    const wallSpecs = (c.floodwall.specs || []).map(sp => `<div class="spec-row"><span>${esc(sp.k)}</span><span>${esc(sp.v)}</span></div>`).join('');
    const wallDims = walls.map(w => `<span class="r"><span>${esc(w.name)}</span><span>${esc(w.dim)} · ${esc(w.kg)}</span></span>`).join('');
    const wallCards = walls.map(f => `
      <article class="wall">
        <div class="wall-media"><img src="${esc(f.img)}" alt="${esc(f.name)}" data-zoom="${esc((c.floodwall.name || '') + ' ' + f.name)}" loading="lazy"></div>
        <div class="wall-body">
          <h4>${esc(f.name)}</h4>
          <span class="d">${esc(f.dim)}<br>น้ำหนัก ${esc(f.kg)}</span>
          <div class="act" data-slot="qty" data-id="${esc(f.id)}" data-unit="${esc(c.floodwall.unit)}" data-variant="wall">${qtyControl(f.id, c.floodwall.unit, 'wall')}</div>
        </div>
      </article>`).join('');

    const stats = (c.pump.stats || []).map(s => `<div class="stat"><small>${esc(s.k)}</small><b>${esc(s.v)}</b><em>${esc(s.sub)}</em></div>`).join('');
    const pSpecs = (c.pump.specs || []).map(s => `<div><span>${esc(s.k)}</span><span>${esc(s.v)}</span></div>`).join('');
    const acc = (c.pump.accessories || []).map(a => `
      <div class="acc-item">
        ${a.contain
          ? `<div class="acc-contain" style="background:${esc(a.bg || '#F2F6FC')}"><img src="${esc(a.img)}" alt="${esc(a.title)}" loading="lazy"></div>`
          : `<img class="acc-cover" src="${esc(a.img)}" alt="${esc(a.title)}" loading="lazy">`}
        <div>${esc(a.title)}</div>
      </div>`).join('');

    const hasAboutImg = !!(c.about && c.about.img);

    return `
<section id="top">
  <div class="hero-img"><img src="${esc(c.hero.banner)}" alt="${esc(c.hero.bannerAlt)}"></div>
  <div class="band hero-band"><div class="wrap">
    <div class="hero-copy"><h1>${esc(c.hero.title)}</h1><p>${esc(c.hero.subtitle)}</p></div>
    <div class="hero-ctas">
      <button class="btn-yellow" data-act="nav" data-to="products">${esc(c.hero.ctaPrimary)}</button>
      <button class="btn-ghost-light" data-act="quote">${esc(c.hero.ctaSecondary)}</button>
    </div>
  </div></div>
</section>

<section class="wrap pillars">${pillars}</section>

<section id="about" class="wrap about">
  <div class="about-grid">
    <div class="about-img">${hasAboutImg
      ? `<img src="${esc(c.about.img)}" alt="${esc(c.about.eyebrow)}">`
      : `<div class="empty">ยังไม่มีรูป · เพิ่มได้ที่ระบบหลังบ้าน</div>`}</div>
    <div class="about-copy">
      <span class="eyebrow">${esc(c.about.eyebrow)}</span>
      <h2 class="h2">${esc(c.about.title)}</h2>
      <p class="body">${esc(c.about.body)}</p>
      <div class="steps">${steps}</div>
    </div>
  </div>
</section>

<section id="products" class="products"><div class="wrap">
  <div class="products-head">
    <span class="eyebrow">${esc(c.products.eyebrow)}</span>
    <h2 class="h2">${esc(c.products.title)}</h2>
    <p class="lead">${esc(c.products.intro)}</p>
  </div>

  <div id="boats" class="cat">${catHead(c.boats, 1)}<div class="boat-grid">${boats}</div></div>

  <div id="pump" class="cat">${catHead(c.pump, 2)}
    <div class="pump-card">
      <div class="pump-media"><img src="${esc(c.pump.img)}" alt="${esc(c.pump.name)}" loading="lazy"></div>
      <div class="pump-info">
        <div class="stats">${stats}</div>
        <div class="pump-specs">${pSpecs}</div>
        <div class="note">${esc(c.pump.notePrefix)} <strong>${esc(c.pump.noteStrong)}</strong> ${esc(c.pump.noteSuffix)}</div>
        <div class="pump-act" data-slot="qty" data-id="pump" data-unit="${esc(c.pump.unit)}" data-variant="pump">${qtyControl('pump', c.pump.unit, 'pump')}</div>
      </div>
    </div>
    <div class="acc"><b>${esc(c.pump.accTitle)}</b><div class="acc-grid">${acc}</div></div>
  </div>

  <div id="floodwall" class="cat">${catHead(c.floodwall, 3)}
    <div class="wall-layout">
      <div class="spec-box">
        <b>${esc(c.floodwall.specTitle)}</b>
        <div class="spec-rows">${wallSpecs}<div class="spec-dims"><span>${esc(c.floodwall.dimsTitle)}</span>${wallDims}</div></div>
      </div>
      <div class="wall-grid">${wallCards}</div>
    </div>
  </div>
</div></section>
${articlesSection(c)}
<section class="band cta"><div class="wrap">
  <div class="cta-copy"><h2>${esc(c.cta.title)}</h2><p>${esc(c.cta.text)}</p></div>
  <button class="btn-yellow" data-act="quote">${esc(c.cta.button)} (<span data-slot="count">${quoteItems().length}</span> รายการ)</button>
</div></section>`;
  }

  // ---------- articles ----------
  const articleList = c => ((c.articles && c.articles.items) || []).filter(a => a && a.title);
  const paragraphs = s => String(s || '').split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const excerptOf = a => a.excerpt || (() => { const p = paragraphs(a.body)[0] || ''; return p.length > 140 ? p.slice(0, 140).trim() + '…' : p; })();

  function articleCard(c, a) {
    return `<article class="art-card">
      <button type="button" class="art-media" data-act="article" data-id="${esc(a.id)}" aria-label="${esc(a.title)}">${a.img ? `<img src="${esc(a.img)}" alt="" loading="lazy">` : ''}</button>
      <div class="art-body">
        ${a.date ? `<span class="art-date">${esc(a.date)}</span>` : ''}
        <h3><button type="button" data-act="article" data-id="${esc(a.id)}">${esc(a.title)}</button></h3>
        <p>${esc(excerptOf(a))}</p>
        <button type="button" class="art-more" data-act="article" data-id="${esc(a.id)}">${esc(c.articles.more || 'อ่านต่อ')} →</button>
      </div>
    </article>`;
  }

  function articlesSection(c) {
    const list = articleList(c).slice(0, 4);
    if (!list.length) return '';
    return `<section id="articles" class="articles"><div class="wrap">
  <div class="articles-head">
    <span class="eyebrow">${esc(c.articles.eyebrow)}</span>
    <h2 class="h2">${esc(c.articles.title)}</h2>
  </div>
  <div class="art-grid">${list.map(a => articleCard(c, a)).join('')}</div>
</div></section>`;
  }

  function articlePage(c) {
    const list = articleList(c);
    const a = list.find(x => x.id === state.articleId);
    if (!a) return `<section class="article-page"><div class="wrap narrow"><p class="lead">ไม่พบบทความนี้</p><button class="btn-blue art-back" data-act="home">${esc(c.articles.back)}</button></div></section>`;
    const others = list.filter(x => x !== a).slice(0, 3);
    return `<section class="article-page"><div class="wrap narrow">
  <button class="art-back-link" data-act="home">${esc(c.articles.back)}</button>
  <header class="art-head">
    <span class="eyebrow">${esc(c.articles.eyebrow)}</span>
    <h1>${esc(a.title)}</h1>
    ${a.date ? `<span class="art-date">${esc(a.date)}</span>` : ''}
  </header>
  ${a.img ? `<div class="art-hero"><img src="${esc(a.img)}" alt="${esc(a.title)}"></div>` : ''}
  <div class="art-content">${paragraphs(a.body).map(p => `<p>${esc(p)}</p>`).join('')}</div>
</div>
${others.length ? `<div class="wrap art-others">
  <h2>${esc(c.articles.otherTitle)}</h2>
  <div class="art-grid three">${others.map(x => articleCard(c, x)).join('')}</div>
</div>` : ''}
</section>`;
  }

  function quoteItemsCard() {
    const items = quoteItems();
    const rows = items.map(q => `
      <div class="qitem">
        <img src="${esc(q.img)}" alt="">
        <div class="t"><b>${esc(q.name)}</b><small>${esc(q.sub)}</small></div>
        <div class="qstep"><button type="button" data-act="dec" data-id="${esc(q.id)}" aria-label="ลดจำนวน">−</button><span>${q.qty}</span><button type="button" data-act="inc" data-id="${esc(q.id)}" aria-label="เพิ่มจำนวน">+</button></div>
        <span class="u">${esc(q.unit)}</span>
      </div>`).join('');
    const options = catalogOf(state.c).map(x => `<option value="${esc(x.id)}">${esc(x.name + ' — ' + x.sub)}</option>`).join('');
    return `
      <div class="card-head">
        <span class="card-title"><i>1</i>รายการสินค้า</span>
        <span>${items.length} รายการ</span>
      </div>
      ${items.length === 0 ? `<span class="empty-box">ยังไม่มีรายการ เลือกสินค้าด้านล่าง หรือกลับไปหน้าสินค้า</span>` : rows}
      <div class="add-row">
        <select class="field" id="add-sel" aria-label="เพิ่มสินค้าอื่น"><option value="">+ เพิ่มสินค้าอื่น…</option>${options}</select>
        <button type="button" class="btn-outline" data-act="add-selected">เพิ่ม</button>
      </div>`;
  }

  function quotePage(c) {
    const head = `<div class="quote-head">
      <span class="eyebrow">${esc(c.quote.eyebrow)}</span>
      <h1>${esc(c.quote.title)}</h1>
      <p class="lead">${esc(c.quote.intro)}</p>
    </div>`;

    if (state.sent) {
      return `<section class="quote-page"><div class="wrap">${head}
        <div class="success">
          <div class="tick">✓</div>
          <h2>${esc(c.quote.successTitle)}</h2>
          <p>เลขที่คำขอ <strong>${esc(state.refNo)}</strong> · ${esc(c.quote.successText)}</p>
          <div class="row">
            <button class="btn-blue" data-act="home">กลับหน้าสินค้า</button>
            <button class="btn-outline" data-act="reset">ส่งคำขอใหม่</button>
          </div>
        </div>
      </div></section>`;
    }

    const docs = lines(c.quote.docs).map((d, i) => `<label><input type="checkbox" name="docs" value="${esc(d)}"${i === 0 ? ' checked' : ''}>${esc(d)}</label>`).join('');
    const orgTypes = lines(c.quote.orgTypes).map(o => `<option value="${esc(o)}">${esc(o)}</option>`).join('');

    return `<section class="quote-page"><div class="wrap">${head}
      <form class="quote-form" id="quote-form">
        <div class="col">
          <div class="card" id="quote-items">${quoteItemsCard()}</div>
          <div class="card">
            <span class="card-title"><i>2</i>เอกสารที่ต้องการ</span>
            <div class="docs">${docs}</div>
            <label class="lbl">รายละเอียดเพิ่มเติม
              <textarea class="field" name="note" rows="4" placeholder="เช่น วงเงินงบประมาณ กำหนดยื่นเอกสาร หรือข้อกำหนดพิเศษ"></textarea>
            </label>
          </div>
        </div>
        <div class="col">
          <div class="card accent">
            <span class="card-title"><i>3</i>ข้อมูลหน่วยงาน</span>
            <label class="lbl">ประเภทหน่วยงาน *
              <select class="field" name="orgType" required><option value="">เลือกประเภท</option>${orgTypes}</select>
            </label>
            <label class="lbl">ชื่อหน่วยงาน / บริษัท *
              <input class="field" name="org" required placeholder="เช่น อบต.บางกระทุ่ม">
            </label>
            <label class="lbl">เลขประจำตัวผู้เสียภาษี
              <input class="field" name="taxId" inputmode="numeric" placeholder="13 หลัก (ถ้ามี)">
            </label>
            <div class="grid2">
              <label class="lbl">ชื่อผู้ติดต่อ *<input class="field" name="contact" required></label>
              <label class="lbl">ตำแหน่ง<input class="field" name="position"></label>
              <label class="lbl">เบอร์โทร *<input class="field" name="phone" type="tel" required></label>
              <label class="lbl">อีเมล<input class="field" name="email" type="email"></label>
              <label class="lbl">จังหวัดที่จัดส่ง *<input class="field" name="province" required placeholder="เช่น อุบลราชธานี"></label>
              <label class="lbl">ต้องการรับสินค้าภายใน<input class="field" name="needBy" type="date" style="padding:11px 14px"></label>
            </div>
            <button type="submit" class="submit">ส่งคำขอใบเสนอราคา</button>
            <span class="req-note">* จำเป็นต้องกรอก</span>
          </div>
          <div class="contact-box">
            <div><small>โทรศัพท์</small><span>${esc(c.contact.phone)}</span></div>
            <div><small>LINE Official</small><span>${esc(c.social.lineId)}</span></div>
            <div><small>อีเมล</small><a href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a></div>
          </div>
        </div>
      </form>
    </div></section>`;
  }

  function footer(c) {
    return `<footer id="contact" class="footer"><div class="wrap">
      <div class="col6">
        <span class="ttl">${esc(c.contact.company)}</span>
        <span class="addr">${esc(c.contact.address)}</span>
        <span>${esc(c.contact.copyright)}</span>
      </div>
      <div class="col6">
        <span>โทร ${esc(c.contact.phone)} · LINE ${esc(c.social.lineId)}</span>
        <a class="mail" href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a>
      </div>
      <div class="col12">
        <span class="ttl">ติดตามเรา</span>
        <div class="socials">
          <a class="social" href="${esc(c.social.facebookUrl)}" target="_blank" rel="noopener" aria-label="Facebook">
            <span class="fb">${FB_SVG(24)}</span><span class="t"><b>Facebook</b><small>${esc(c.social.facebookName)}</small></span>
          </a>
          <a class="social" href="${esc(c.social.lineUrl)}" target="_blank" rel="noopener" aria-label="LINE Official Account">
            <span class="ln">${LINE_SVG(30)}</span><span class="t"><b>LINE OA</b><small>${esc(c.social.lineId)}</small></span>
          </a>
        </div>
      </div>
    </div></footer>`;
  }

  // ---------- render ----------
  function render() {
    const c = state.c;
    const page = state.page === 'quote' ? quotePage(c) : state.page === 'article' ? articlePage(c) : home(c);
    app.innerHTML = topbar(c) + header(c) + page + footer(c);
    const a = state.page === 'article' && articleList(c).find(x => x.id === state.articleId);
    document.title = a ? `${a.title} · KTS` : baseTitle;
  }
  const baseTitle = document.title;

  function refreshQty() {
    const n = quoteItems().length;
    app.querySelectorAll('[data-slot="count"]').forEach(el => { el.textContent = n; });
    app.querySelectorAll('[data-slot="qty"]').forEach(el => { el.innerHTML = qtyControl(el.dataset.id, el.dataset.unit, el.dataset.variant); });
    const card = document.getElementById('quote-items');
    if (card) card.innerHTML = quoteItemsCard();
  }

  function setQty(id, d) {
    const n = (state.quote[id] || 0) + d;
    if (n <= 0) delete state.quote[id]; else state.quote[id] = n;
    refreshQty();
  }

  // Article pages live at #article/<id> so they can be linked to and the browser Back button works.
  const ARTICLE_HASH = /^#article\/(.+)$/;
  const leaveArticleHash = () => { if (ARTICLE_HASH.test(location.hash)) history.pushState(null, '', location.pathname + location.search); };
  function route() {
    const m = location.hash.match(ARTICLE_HASH);
    if (m) { state.page = 'article'; state.articleId = decodeURIComponent(m[1]); }
    else if (state.page === 'article') { // browser Back: return to the article cards
      state.page = 'home'; render();
      // run after the browser's own scroll restoration for the history entry
      const toCards = () => { const el = document.getElementById('articles'); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' }); };
      toCards(); setTimeout(toCards, 60);
      return true;
    }
    else return false;
    render(); window.scrollTo({ top: 0, behavior: 'instant' });
    return true;
  }
  window.addEventListener('hashchange', route);
  window.addEventListener('popstate', route);

  function go(page) { leaveArticleHash(); state.page = page; render(); window.scrollTo({ top: 0, behavior: 'instant' }); }

  function navTo(id) {
    leaveArticleHash();
    const jump = behavior => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior }); };
    if (state.page === 'home') { jump('smooth'); return; }
    state.page = 'home'; render();
    requestAnimationFrame(() => jump('instant'));
    setTimeout(() => jump('instant'), 400);
  }

  // ---------- zoom ----------
  let zoomEl = null;
  function openZoom(img, alt) {
    const r = img.getBoundingClientRect();
    const nr = (img.naturalWidth || r.width) / (img.naturalHeight || r.height);
    let w = r.width, h = r.height;
    if (w / h > nr) w = h * nr; else h = w / nr;
    w *= 2; h *= 2;
    const maxW = window.innerWidth * 0.9 - 40, maxH = window.innerHeight * 0.86 - 80;
    const k = Math.min(1, maxW / w, maxH / h);
    closeZoom();
    zoomEl = document.createElement('div');
    zoomEl.className = 'zoom';
    zoomEl.innerHTML = `<div class="zoom-box"><img src="${esc(img.currentSrc || img.src)}" alt="${esc(alt)}" style="width:${Math.round(w * k)}px;height:${Math.round(h * k)}px"><span>${esc(alt)}</span><button class="zoom-close" aria-label="ปิด">×</button></div>`;
    zoomEl.addEventListener('click', closeZoom);
    document.body.appendChild(zoomEl);
  }
  function closeZoom() { if (zoomEl) { zoomEl.remove(); zoomEl = null; } }
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeZoom(); });

  // ---------- events ----------
  app.addEventListener('click', e => {
    const z = e.target.closest('img[data-zoom]');
    if (z) { openZoom(z, z.dataset.zoom); return; }
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act;
    if (act === 'home') go('home');
    else if (act === 'quote') go('quote');
    else if (act === 'article') location.hash = 'article/' + encodeURIComponent(t.dataset.id);
    else if (act === 'nav') navTo(t.dataset.to);
    else if (act === 'inc') setQty(t.dataset.id, 1);
    else if (act === 'dec') setQty(t.dataset.id, -1);
    else if (act === 'add-selected') { const sel = document.getElementById('add-sel'); if (sel && sel.value) setQty(sel.value, 1); }
    else if (act === 'reset') { state.sent = false; state.quote = {}; render(); }
  });

  // Quote requests are emailed via FormSubmit (no backend on this static site).
  const QUOTE_ENDPOINT = 'https://formsubmit.co/ajax/klangtechnology@gmail.com';
  const sendQuoteMail = req => fetch(QUOTE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      _subject: `ขอใบเสนอราคา ${req.ref} · ${req.org}`,
      _template: 'table',
      ...(req.email ? { _replyto: req.email } : {}),
      'เลขที่คำขอ': req.ref,
      'รายการสินค้า': req.items.length ? req.items.map(x => `${x.name}${x.sub ? ` (${x.sub})` : ''} × ${x.qty} ${x.unit}`).join('\n') : '-',
      'เอกสารที่ต้องการ': req.docs.join(', ') || '-',
      'ประเภทหน่วยงาน': req.orgType, 'ชื่อหน่วยงาน / บริษัท': req.org, 'เลขประจำตัวผู้เสียภาษี': req.taxId || '-',
      'ชื่อผู้ติดต่อ': req.contact, 'ตำแหน่ง': req.position || '-', 'เบอร์โทร': req.phone, 'อีเมล': req.email || '-',
      'จังหวัดที่จัดส่ง': req.province, 'ต้องการรับสินค้าภายใน': req.needBy || '-', 'รายละเอียดเพิ่มเติม': req.note || '-',
    }),
  }).then(r => r.json()).then(j => { if (String(j.success) !== 'true') throw new Error(j.message || 'send failed'); });

  app.addEventListener('submit', async e => {
    if (e.target.id !== 'quote-form') return;
    e.preventDefault();
    const btn = e.target.querySelector('.submit');
    if (btn.disabled) return;
    const fd = new FormData(e.target);
    const data = {};
    fd.forEach((v, k) => { if (k !== 'docs') data[k] = v; });
    const ref = 'KTS-' + String(Date.now()).slice(-6);
    const req = { ref, at: new Date().toISOString(), status: 'new', ...data, docs: fd.getAll('docs'),
      items: quoteItems().map(x => ({ name: x.name, sub: x.sub, qty: x.qty, unit: x.unit })) };
    const label = btn.textContent;
    btn.disabled = true; btn.textContent = 'กำลังส่ง…';
    try { await sendQuoteMail(req); }
    catch (err) {
      btn.disabled = false; btn.textContent = label;
      alert(`ส่งคำขอไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อ ${state.c.contact.phone}`);
      return;
    }
    window.KTSCMS.addRequest(req).catch(() => {});
    state.sent = true; state.refNo = ref;
    render(); window.scrollTo({ top: 0, behavior: 'instant' });
  });

  // ---------- boot ----------
  if (!route()) render();
  const jumpToHash = () => { const el = location.hash.length > 1 && document.getElementById(location.hash.slice(1)); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'instant' }); };
  if (location.hash.length > 1) { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.addEventListener('load', () => setTimeout(jumpToHash, 50)); }
  const reload = () => window.KTSCMS.load().then(c => {
    state.c = c;
    // don't wipe what someone has typed into the quote form; new content shows on the next page change
    if (state.page === 'quote' && !state.sent) { refreshQty(); return; }
    render();
  });
  reload();
  window.KTSCMS.subscribe(m => { if (m.type === 'content') reload(); });
})();
