(function () {
  const CMS = window.KTSCMS;
  const app = document.getElementById('app');
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  // ---------- section / field schema ----------
  const T = (p, l, h) => ({ p, l, t: 'text', h });
  const A = (p, l, h, rows) => ({ p, l, t: 'area', h, rows });
  const L = (p, l, h) => ({ p, l, t: 'lines', h });
  const I = (p, l, h) => ({ p, l, t: 'image', h });
  const Bo = (p, l) => ({ p, l, t: 'bool' });
  const KV = [T('k', 'หัวข้อ'), T('v', 'ค่า')];

  const SECTIONS = [
    { g: 'ภาพรวม' },
    { key: 'dashboard', label: 'แดชบอร์ด', kind: 'dashboard' },
    { g: 'เนื้อหาเว็บไซต์' },
    { key: 'general', label: 'โลโก้ · แถบบน · เมนู', desc: 'โลโก้ ข้อความแถบบนสุด และชื่อเมนู', fields: [
      I('logo', 'โลโก้บริษัท', 'แนะนำ PNG พื้นใส สูงอย่างน้อย 120px'),
      T('topbar.text', 'ข้อความแถบบนสุด'),
      T('nav.home', 'เมนู: หน้าแรก'), T('nav.about', 'เมนู: เกี่ยวกับเรา'), T('nav.products', 'เมนู: สินค้า'), T('nav.contact', 'เมนู: ติดต่อเรา'), T('nav.quote', 'ปุ่มขอใบเสนอราคา'),
    ] },
    { key: 'social', label: 'Facebook · LINE OA', desc: 'ลิงก์ที่ไอคอนด้านบนและด้านล่างของเว็บ', fields: [
      T('social.facebookUrl', 'ลิงก์เพจ Facebook', 'เช่น https://www.facebook.com/ชื่อเพจ'), T('social.facebookName', 'ชื่อเพจ Facebook'),
      T('social.lineUrl', 'ลิงก์ LINE OA', 'เช่น https://line.me/R/ti/p/@ไอดี'), T('social.lineId', 'LINE ID'),
    ] },
    { key: 'hero', label: 'แบนเนอร์หน้าแรก', desc: 'รูปแบนเนอร์และข้อความใต้แบนเนอร์', fields: [
      I('hero.banner', 'รูปแบนเนอร์', 'แนะนำ 2034 × 773 px'), T('hero.bannerAlt', 'คำอธิบายรูป (สำหรับ SEO)'),
      A('hero.title', 'หัวข้อหลัก', '', 2), A('hero.subtitle', 'ข้อความรอง'),
      T('hero.ctaPrimary', 'ปุ่มหลัก'), T('hero.ctaSecondary', 'ปุ่มรอง'),
    ] },
    { key: 'pillars', label: 'การ์ด 3 หมวดหลัก', desc: 'การ์ด กั้นน้ำ / ระบายน้ำ / ช่วยเหลือและอพยพ ใต้แบนเนอร์', fields: [
      { p: 'pillars', l: 'การ์ด', t: 'list', fixed: true, titleKey: 'label', item: [I('img', 'รูปการ์ด'), T('label', 'ชื่อหมวด'), A('text', 'คำอธิบาย', '', 2)] },
    ] },
    { key: 'about', label: 'เกี่ยวกับเรา', fields: [
      T('about.eyebrow', 'หัวข้อเล็ก'), A('about.title', 'หัวข้อใหญ่', 'กด Enter เพื่อขึ้นบรรทัดใหม่', 2), A('about.body', 'เนื้อหา', '', 4),
      I('about.img', 'รูปประกอบ', 'แนะนำแนวนอน 5:4'),
      { p: 'about.steps', l: 'ขั้นตอนการทำงาน', t: 'list', titleKey: 'title', item: [T('title', 'หัวข้อ'), T('text', 'รายละเอียด')], blank: () => ({ title: 'ขั้นตอนใหม่', text: '' }) },
    ] },
    { g: 'สินค้า' },
    { key: 'products', label: 'หัวข้อส่วนสินค้า', fields: [T('products.eyebrow', 'หัวข้อเล็ก'), T('products.title', 'หัวข้อใหญ่'), A('products.intro', 'คำอธิบาย')] },
    { key: 'boats', label: 'เรือท้องแบน', desc: 'หมวด 01 · ช่วยเหลือและอพยพ', fields: [
      T('boats.tag', 'ป้ายหมวด'), T('boats.title', 'หัวข้อหมวด'), T('boats.meta', 'ข้อความด้านขวาหัวข้อ'), T('boats.name', 'ชื่อสินค้า (นำหน้าชื่อรุ่น)'),
      T('boats.unit', 'หน่วยนับ'), T('boats.moldLabel', 'ป้าย “มีแม่พิมพ์ขึ้นรูป”'), T('boats.engLabel', 'ป้าย “พร้อมเครื่องยนต์”'), T('boats.hullLabel', 'ป้าย “เฉพาะตัวเรือ”'),
      { p: 'boats.items', l: 'รายการเรือ', t: 'list', titleFn: it => `รุ่น ${it.m || '-'} · ${it.sub || ''}`, item: [
        T('m', 'รุ่น'), T('sub', 'คำอธิบายสั้น (ใช้ในใบเสนอราคา)'), I('img', 'รูปสินค้า'),
        Bo('hasEng', 'พร้อมเครื่องยนต์'), Bo('mold', 'แสดงป้ายมีแม่พิมพ์ขึ้นรูป'),
        T('len', 'ความยาว (ม.)'), T('w', 'ความกว้าง (ม.)'), T('h', 'ความสูงขอบนอก (ม.)'),
        A('line1', 'รายละเอียด บรรทัด 1', '', 2), A('line2', 'รายละเอียด บรรทัด 2', '', 2), A('line3', 'รายละเอียด บรรทัด 3', '', 2),
      ], blank: () => ({ id: 'B-' + Date.now(), m: 'รุ่นใหม่', sub: '', img: '', hasEng: false, mold: false, len: '', w: '', h: '', line1: '', line2: '', line3: '' }) },
    ] },
    { key: 'pump', label: 'เครื่องสูบระบายน้ำ', desc: 'หมวด 02 · ระบายน้ำ', fields: [
      T('pump.tag', 'ป้ายหมวด'), T('pump.title', 'หัวข้อหมวด'), A('pump.meta', 'ข้อความด้านขวาหัวข้อ', '', 2), I('pump.img', 'รูปเครื่องสูบ'),
      T('pump.name', 'ชื่อสินค้า (ใช้ในใบเสนอราคา)'), T('pump.quoteSub', 'คำอธิบายสั้น'), T('pump.unit', 'หน่วยนับ'),
      { p: 'pump.stats', l: 'ตัวเลขเด่น', t: 'list', titleFn: it => `${it.k || '-'}: ${it.v || ''}`, item: [T('k', 'หัวข้อ'), T('v', 'ค่า'), T('sub', 'หมายเหตุใต้ค่า')], blank: () => ({ k: '', v: '', sub: '' }) },
      { p: 'pump.specs', l: 'รายละเอียดสเปก', t: 'list', titleFn: it => `${it.k || '-'}: ${it.v || ''}`, item: KV, blank: () => ({ k: '', v: '' }) },
      T('pump.notePrefix', 'กล่องแนะนำ: ข้อความนำ'), T('pump.noteStrong', 'กล่องแนะนำ: ตัวหนา'), T('pump.noteSuffix', 'กล่องแนะนำ: ข้อความต่อท้าย'),
      T('pump.accTitle', 'หัวข้ออุปกรณ์ประกอบ'),
      { p: 'pump.accessories', l: 'อุปกรณ์ประกอบ', t: 'list', titleKey: 'title', item: [T('title', 'ชื่ออุปกรณ์'), I('img', 'รูป'), Bo('contain', 'แสดงรูปทั้งหมด (ไม่ครอบตัด)'), T('bg', 'สีพื้นหลังรูป', 'เช่น #A0A0A1')], blank: () => ({ title: 'อุปกรณ์ใหม่', img: '', contain: false, bg: '' }) },
    ] },
    { key: 'floodwall', label: 'กำแพงกั้นน้ำ', desc: 'หมวด 03 · กั้นน้ำ', fields: [
      T('floodwall.tag', 'ป้ายหมวด'), T('floodwall.title', 'หัวข้อหมวด'), T('floodwall.meta', 'ข้อความด้านขวาหัวข้อ'), T('floodwall.name', 'ชื่อสินค้า'),
      T('floodwall.unit', 'หน่วยนับ'), T('floodwall.specTitle', 'หัวข้อกล่องคุณลักษณะ'), T('floodwall.dimsTitle', 'หัวข้อขนาด/น้ำหนัก'),
      { p: 'floodwall.specs', l: 'คุณลักษณะ', t: 'list', titleFn: it => `${it.k || '-'}: ${it.v || ''}`, item: KV, blank: () => ({ k: '', v: '' }) },
      { p: 'floodwall.items', l: 'แบบกำแพงกั้นน้ำ', t: 'list', titleKey: 'name', item: [T('name', 'ชื่อแบบ'), T('dim', 'ขนาด'), T('kg', 'น้ำหนัก'), I('img', 'รูปสินค้า')], blank: () => ({ id: 'FW-' + Date.now(), name: 'แบบใหม่', dim: '', kg: '', img: '' }) },
    ] },
    { g: 'ส่วนอื่น ๆ' },
    { key: 'cta', label: 'แถบชวนขอใบเสนอราคา', fields: [A('cta.title', 'หัวข้อ', '', 2), A('cta.text', 'ข้อความ', '', 2), T('cta.button', 'ข้อความปุ่ม')] },
    { key: 'quote', label: 'หน้าขอใบเสนอราคา', fields: [
      T('quote.eyebrow', 'หัวข้อเล็ก'), T('quote.title', 'หัวข้อใหญ่'), A('quote.intro', 'คำอธิบาย'),
      L('quote.orgTypes', 'ตัวเลือกประเภทหน่วยงาน', '1 บรรทัด = 1 ตัวเลือก'), L('quote.docs', 'ตัวเลือกเอกสารที่ต้องการ', '1 บรรทัด = 1 ตัวเลือก (บรรทัดแรกติ๊กไว้ให้)'),
      T('quote.successTitle', 'ข้อความเมื่อส่งสำเร็จ'), A('quote.successText', 'รายละเอียดเมื่อส่งสำเร็จ', '', 2),
    ] },
    { key: 'contact', label: 'ข้อมูลติดต่อ · Footer', fields: [
      T('contact.company', 'ชื่อบริษัท'), T('contact.phone', 'เบอร์โทร'), T('contact.email', 'อีเมล'), T('contact.copyright', 'ข้อความลิขสิทธิ์'), A('contact.address', 'ที่อยู่', '', 2),
    ] },
    { g: 'ระบบ' },
    { key: 'requests', label: 'คำขอใบเสนอราคา', kind: 'requests' },
    { key: 'settings', label: 'ตั้งค่า', kind: 'settings' },
  ];

  // ---------- utils ----------
  const getIn = (o, p) => p.reduce((a, k) => (a == null ? undefined : a[k]), o);
  const setIn = (o, p, v) => { if (!p.length) return v; const [k, ...r] = p; const c = Array.isArray(o) ? o.slice() : { ...(o || {}) }; c[k] = setIn(o ? o[k] : undefined, r, v); return c; };
  const fmt = iso => { try { return new Date(iso).toLocaleString('th-TH', { dateStyle: 'medium', timeStyle: 'short' }); } catch (e) { return iso || '-'; } };
  const P = s => s.split('.');

  async function fileToDataURL(file) {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
    }
    const url = URL.createObjectURL(file);
    try { return await compressImage(url, file.type === 'image/png' || file.type === 'image/webp'); }
    finally { URL.revokeObjectURL(url); }
  }

  // Images end up inside content.json, so keep them small: WebP keeps PNG transparency; browsers without WebP encoding fall back to PNG.
  async function compressImage(src, keepAlpha) {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
    const k = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    const x = c.getContext('2d'); x.imageSmoothingQuality = 'high'; x.drawImage(img, 0, 0, c.width, c.height);
    if (keepAlpha) {
      const w = c.toDataURL('image/webp', 0.85);
      return w.startsWith('data:image/webp') ? w : c.toDataURL('image/png');
    }
    return c.toDataURL('image/jpeg', 0.82);
  }

  // Re-compress any large embedded image (e.g. ones uploaded before compression existed) so content.json stays light.
  async function shrinkImages(o) {
    if (typeof o === 'string') {
      if (!/^data:image\/(png|jpeg|webp);/.test(o) || o.length < 400000) return o;
      try { const s = await compressImage(o, !o.startsWith('data:image/jpeg')); return s.length < o.length ? s : o; } catch (e) { return o; }
    }
    if (Array.isArray(o)) { const r = []; for (const v of o) r.push(await shrinkImages(v)); return r; }
    if (o && typeof o === 'object') { const r = {}; for (const k in o) r[k] = await shrinkImages(o[k]); return r; }
    return o;
  }

  // ---------- state ----------
  let authed = false;
  try { authed = sessionStorage.getItem('kts-admin') === '1'; } catch (e) {}
  const S = { authed, err: '', section: 'dashboard', draft: CMS.clone(CMS.DEFAULTS), dirty: false, saving: false,
    open: {}, busy: null, requests: [], reqFilter: 'all' };
  const listDefs = {};

  let toastT = null;
  function toast(msg) {
    clearTimeout(toastT);
    let el = document.querySelector('.toast');
    if (!el) { el = document.createElement('div'); el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = msg;
    toastT = setTimeout(() => el.remove(), 2600);
  }

  function upd(path, v) { S.draft = setIn(S.draft, path, v); const was = S.dirty; S.dirty = true; if (!was) renderTop(); }

  // ---------- field rendering ----------
  function itemTitle(f, it, i) { return f.titleFn ? f.titleFn(it || {}) : ((it && it[f.titleKey]) || `รายการ ${i + 1}`); }

  function mk(f, base) {
    const path = [...base, ...P(f.p)];
    const key = path.join('.');
    const v = getIn(S.draft, path);
    const hint = f.h ? `<span class="f-hint">${esc(f.h)}</span>` : '';

    if (f.t === 'text') {
      return `<label class="f-label">${esc(f.l)}<input class="f-input" data-path="${esc(key)}" value="${esc(v)}">${hint}</label>`;
    }
    if (f.t === 'area' || f.t === 'lines') {
      const rows = f.rows || (f.t === 'lines' ? 6 : 3);
      return `<label class="f-label full">${esc(f.l)}<textarea class="f-input" data-path="${esc(key)}" rows="${rows}">${esc(v)}</textarea>${hint}</label>`;
    }
    if (f.t === 'bool') {
      return `<button type="button" class="f-bool" data-act="toggle" data-path="${esc(key)}" aria-pressed="${v ? 'true' : 'false'}"><span class="switch${v ? ' on' : ''}"><i></i></span>${esc(f.l)}</button>`;
    }
    if (f.t === 'image') {
      const label = S.busy === key ? 'กำลังอัปโหลด…' : (v ? 'เปลี่ยนรูป' : 'อัปโหลดรูป');
      return `<div class="f-image">
        <div class="f-thumb">${v ? `<img src="${esc(v)}" alt="">` : '<span>ยังไม่มีรูป</span>'}</div>
        <div class="meta">
          <b>${esc(f.l)}</b>${hint}
          <div class="btn-row">
            <label class="btn-upload">${label}<input type="file" accept="image/*" data-upload="${esc(key)}"></label>
            ${v ? `<button type="button" class="btn-clear" data-act="clear" data-path="${esc(key)}">ลบรูป</button>` : ''}
          </div>
        </div>
      </div>`;
    }
    if (f.t === 'list') {
      listDefs[key] = f;
      const arr = Array.isArray(v) ? v : [];
      const anyOpen = arr.some((_, i) => S.open[key + '.' + i]);
      const items = arr.map((it, i) => {
        const open = !!S.open[key + '.' + i];
        return `<div class="li" data-list="${esc(key)}" data-idx="${i}">
          <div class="li-head">
            <button type="button" class="li-toggle" data-act="li-toggle" data-key="${esc(key)}" data-idx="${i}" aria-expanded="${open}">
              <span class="li-idx">${i + 1}</span>
              ${it && it.img ? `<img class="li-thumb" src="${esc(it.img)}" alt="">` : ''}
              <span class="li-title">${esc(itemTitle(f, it, i))}</span>
              <span class="li-chev">${open ? 'ย่อ ▴' : 'แก้ไข ▾'}</span>
            </button>
            <div class="li-tools">
              <button type="button" data-act="li-move" data-key="${esc(key)}" data-idx="${i}" data-d="-1" aria-label="เลื่อนขึ้น">↑</button>
              <button type="button" data-act="li-move" data-key="${esc(key)}" data-idx="${i}" data-d="1" aria-label="เลื่อนลง">↓</button>
              ${f.fixed ? '' : `<button type="button" class="rm" data-act="li-rm" data-key="${esc(key)}" data-idx="${i}" aria-label="ลบ">ลบ</button>`}
            </div>
          </div>
          ${open ? `<div class="li-body sub">${f.item.map(sf => mk(sf, [...path, String(i)])).join('')}</div>` : ''}
        </div>`;
      }).join('');
      return `<div class="f-list">
        <div class="f-list-head">
          <span>${esc(f.l)} <small>(${arr.length} รายการ)</small></span>
          <button type="button" class="link-btn" data-act="li-all" data-key="${esc(key)}">${anyOpen ? 'ย่อทั้งหมด' : 'ขยายทั้งหมด'}</button>
        </div>
        ${items}
        ${f.fixed ? '' : `<button type="button" class="btn-add" data-act="li-add" data-key="${esc(key)}">+ เพิ่มรายการ</button>`}
      </div>`;
    }
    return '';
  }

  // ---------- views ----------
  const currentSection = () => SECTIONS.find(x => x.key === S.section) || SECTIONS[1];
  const newReqCount = () => S.requests.filter(r => r.status !== 'done').length;

  function loginView() {
    return `<div class="login"><form id="login-form">
      <img src="${esc(S.draft.logo)}" alt="KTS">
      <div class="hd"><h1>ระบบหลังบ้าน</h1><span>จัดการเนื้อหา รูปภาพ และคำขอใบเสนอราคา</span></div>
      <label>รหัสผ่าน<input type="password" id="login-pw" autocomplete="current-password" autofocus></label>
      ${S.err ? `<span class="err" role="alert">${esc(S.err)}</span>` : ''}
      <button type="submit">เข้าสู่ระบบ</button>
      <span class="hint">รหัสผ่านเริ่มต้น: kts1234 · เปลี่ยนได้ที่เมนูตั้งค่า</span>
    </form></div>`;
  }

  function asideView() {
    const n = newReqCount();
    const nav = SECTIONS.map(x => {
      if (x.g) return `<span class="nav-group">${esc(x.g)}</span>`;
      const badge = x.key === 'requests' && n > 0 ? `<span class="nav-badge">${n}</span>` : '';
      return `<button class="nav-item${x.key === S.section ? ' active' : ''}" data-act="go" data-key="${x.key}">${esc(x.label)}${badge}</button>`;
    }).join('');
    return `<div class="brand">
        <span class="lg"><img src="${esc(S.draft.logo)}" alt="KTS"></span>
        <span class="nm"><b>ระบบหลังบ้าน</b><small>Content Manager</small></span>
      </div>
      ${nav}
      <div class="aside-foot">
        <a class="view-site" href="./index.html" target="_blank" rel="noopener">ดูหน้าเว็บไซต์ ↗</a>
        <button class="logout" data-act="logout">ออกจากระบบ</button>
      </div>`;
  }

  function topView() {
    const d = S.draft;
    const sec = currentSection();
    const right = S.dirty
      ? `<span class="pill-warn">มีการแก้ไขที่ยังไม่บันทึก</span>
         <button class="btn-discard" data-act="discard">ยกเลิกการแก้ไข</button>
         <button class="btn-save" data-act="save">${S.saving ? 'กำลังบันทึก…' : 'บันทึก'}</button>`
      : `<span class="pill-ok">บันทึกแล้ว</span>`;
    return `<div class="topbar-in">
      <div class="ttl"><h1>${esc(sec.label)}</h1><span>${d.updatedAt ? `บันทึกล่าสุด ${esc(fmt(d.updatedAt))}` : 'ยังไม่เคยบันทึก · แสดงเนื้อหาเริ่มต้น'}</span></div>
      <div class="top-actions">${right}</div>
    </div>`;
  }

  function dashboardView() {
    const d = S.draft;
    const boatCount = ((d.boats && d.boats.items) || []).length, wallCount = ((d.floodwall && d.floodwall.items) || []).length;
    const shortcuts = SECTIONS.filter(x => x.key && !x.kind).map(x =>
      `<button class="shortcut" data-act="go" data-key="${x.key}"><b>${esc(x.label)}</b><span>${esc(x.desc || `${x.fields.length} ช่องข้อมูล`)}</span></button>`).join('');
    return `<div class="kpis">
        <button class="kpi primary" data-act="go" data-key="requests"><small>คำขอใบเสนอราคาใหม่</small><b>${newReqCount()}</b><span>ทั้งหมด ${S.requests.length} รายการ →</span></button>
        <div class="kpi"><small>สินค้าบนเว็บไซต์</small><b>${boatCount + wallCount + 1}</b><span>เรือ ${boatCount} · กำแพงกั้นน้ำ ${wallCount} · เครื่องสูบ 1</span></div>
        <div class="kpi"><small>อัปเดตเนื้อหาล่าสุด</small><b class="sm">${d.updatedAt ? esc(fmt(d.updatedAt)) : 'ยังไม่เคยแก้ไข'}</b></div>
      </div>
      <div class="panel"><span class="panel-title">แก้ไขส่วนต่าง ๆ ของเว็บไซต์</span><div class="shortcuts">${shortcuts}</div></div>
      <div class="howto">วิธีใช้: เลือกส่วนที่ต้องการทางซ้าย แก้ข้อความหรือกด “อัปโหลดรูปใหม่” แล้วกด <strong>บันทึก</strong> ด้านบน หน้าเว็บไซต์ที่เปิดอยู่จะอัปเดตทันที</div>`;
  }

  function formView(sec) {
    return `${sec.desc ? `<span class="sec-desc">${esc(sec.desc)}</span>` : ''}
      <div class="form-card">${sec.fields.map(f => mk(f, [])).join('')}</div>`;
  }

  function requestsView() {
    const filters = [['all', 'ทั้งหมด'], ['new', 'ยังไม่ดำเนินการ'], ['done', 'ดำเนินการแล้ว']].map(([k, label]) =>
      `<button class="filter${S.reqFilter === k ? ' active' : ''}" data-act="req-filter" data-key="${k}">${label}</button>`).join('');
    const reqs = S.requests.filter(r => S.reqFilter === 'all' || (S.reqFilter === 'new' ? r.status !== 'done' : r.status === 'done'));
    const cards = reqs.map(r => {
      const done = r.status === 'done';
      const items = (r.items || []).map(ri => `<span class="req-item"><span>${esc(ri.name)}<br><small>${esc(ri.sub)}</small></span><b>× ${esc(ri.qty)} ${esc(ri.unit)}</b></span>`).join('');
      return `<article class="req">
        <div class="req-head">
          <div class="l">
            <span class="t"><b>${esc(r.org || '-')}</b>${done ? '<span class="tag-done">ดำเนินการแล้ว</span>' : '<span class="tag-new">ใหม่</span>'}</span>
            <span class="m">${esc(r.ref)} · ${esc(fmt(r.at))} · ${esc(r.orgType || '-')}</span>
          </div>
          <div class="btn-row">
            <button class="req-btn" data-act="req-done" data-ref="${esc(r.ref)}">${done ? 'ทำเครื่องหมายว่ายังไม่ดำเนินการ' : 'ทำเครื่องหมายว่าดำเนินการแล้ว'}</button>
            <button class="req-btn rm" data-act="req-rm" data-ref="${esc(r.ref)}">ลบ</button>
          </div>
        </div>
        <div class="req-body">
          <div>
            <span class="kv"><span>ผู้ติดต่อ</span><span>${esc([r.contact, r.position].filter(Boolean).join(' · ') || '-')}</span></span>
            <span class="kv"><span>โทร</span><a href="tel:${esc(r.phone || '')}">${esc(r.phone || '-')}</a></span>
            <span class="kv"><span>อีเมล</span><a href="mailto:${esc(r.email || '')}">${esc(r.email || '-')}</a></span>
            <span class="kv"><span>จังหวัดที่จัดส่ง</span><span>${esc(r.province || '-')}</span></span>
            <span class="kv"><span>ต้องการภายใน</span><span>${esc(r.needBy || '-')}</span></span>
            <span class="kv"><span>เลขผู้เสียภาษี</span><span>${esc(r.taxId || '-')}</span></span>
          </div>
          <div>
            <span class="req-items-title">รายการสินค้า</span>
            ${items}
            <span class="req-docs">เอกสาร: <span>${esc((r.docs || []).join(', ') || '-')}</span></span>
            ${r.note ? `<span class="req-note">${esc(r.note)}</span>` : ''}
          </div>
        </div>
      </article>`;
    }).join('');
    return `<div class="filters">${filters}</div>
      ${reqs.length === 0 ? '<div class="req-empty">ยังไม่มีคำขอใบเสนอราคา · เมื่อมีผู้กรอกฟอร์มบนเว็บไซต์ รายการจะแสดงที่นี่</div>' : cards}`;
  }

  function settingsView() {
    return `<form class="panel" id="pw-form">
        <span class="panel-title">เปลี่ยนรหัสผ่าน</span>
        <div class="set-grid">
          <label class="f-label">รหัสผ่านปัจจุบัน<input class="f-input" type="password" id="pw-cur" autocomplete="current-password"></label>
          <label class="f-label">รหัสผ่านใหม่ (อย่างน้อย 6 ตัว)<input class="f-input" type="password" id="pw-new" autocomplete="new-password"></label>
        </div>
        <button type="submit" class="btn-primary">บันทึกรหัสผ่านใหม่</button>
      </form>
      <div class="panel">
        <span class="panel-title">สำรองและกู้คืนข้อมูล</span>
        <p>ดาวน์โหลดเนื้อหาทั้งหมด (รวมรูปภาพ) เป็นไฟล์ .json เก็บไว้ หรือนำเข้าไฟล์ที่สำรองไว้</p>
        <div class="btn-row" style="gap:10px">
          <button class="btn-primary" data-act="export">ดาวน์โหลดไฟล์สำรอง</button>
          <label class="btn-secondary">นำเข้าไฟล์สำรอง<input type="file" accept="application/json,.json" id="import-file"></label>
        </div>
      </div>
      <div class="panel danger">
        <span class="panel-title">คืนค่าเริ่มต้น</span>
        <p>ล้างการแก้ไขทั้งหมด แล้วกลับไปใช้เนื้อหาและรูปภาพชุดเริ่มต้น (คำขอใบเสนอราคาไม่ถูกลบ)</p>
        <button class="btn-danger" data-act="reset">คืนค่าเริ่มต้นทั้งหมด</button>
      </div>`;
  }

  // ---------- render ----------
  function renderAll() {
    if (!S.authed) { app.innerHTML = loginView(); const pw = document.getElementById('login-pw'); if (pw) pw.focus(); return; }
    app.innerHTML = `<div class="shell"><aside class="aside" id="aside"></aside><main class="main"><div class="topbar" id="top"></div><div class="content" id="content"></div></main></div>`;
    renderAside(); renderTop(); renderContent();
  }
  function renderAside() { const el = document.getElementById('aside'); if (el) el.innerHTML = asideView(); }
  function renderTop() { const el = document.getElementById('top'); if (el) el.innerHTML = topView(); }
  function renderContent() {
    const el = document.getElementById('content'); if (!el) return;
    const sec = currentSection();
    el.innerHTML = sec.kind === 'dashboard' ? dashboardView()
      : sec.kind === 'requests' ? requestsView()
      : sec.kind === 'settings' ? settingsView()
      : formView(sec);
  }

  // ---------- actions ----------
  async function save() {
    if (S.saving) return;
    S.saving = true; renderTop();
    try { S.draft = await shrinkImages(S.draft); const at = await CMS.save(S.draft); S.draft = { ...S.draft, updatedAt: at }; S.dirty = false; toast('บันทึกแล้ว · หน้าเว็บอัปเดตทันที'); }
    catch (e) { toast('บันทึกไม่สำเร็จ'); }
    S.saving = false; renderTop(); renderAside();
    if (currentSection().kind === 'dashboard') renderContent();
  }

  function listAt(key) { return (getIn(S.draft, P(key)) || []).slice(); }

  function loadRequests() { return CMS.listRequests().then(r => { S.requests = r; if (S.authed) { renderAside(); const k = currentSection().kind; if (k === 'requests' || k === 'dashboard') renderContent(); } }); }

  app.addEventListener('click', async e => {
    const t = e.target.closest('[data-act]');
    if (!t) return;
    const act = t.dataset.act, key = t.dataset.key, idx = Number(t.dataset.idx);
    switch (act) {
      case 'go':
        S.section = key; renderAside(); renderTop(); renderContent(); window.scrollTo({ top: 0, behavior: 'instant' }); break;
      case 'logout':
        if (S.dirty && !window.confirm('มีการแก้ไขที่ยังไม่บันทึก ออกจากระบบเลยหรือไม่?')) return;
        try { sessionStorage.removeItem('kts-admin'); } catch (er) {}
        S.authed = false; renderAll(); break;
      case 'save': save(); break;
      case 'discard':
        if (!window.confirm('ยกเลิกการแก้ไขทั้งหมดที่ยังไม่บันทึก?')) return;
        S.draft = await CMS.load(); S.dirty = false; S.open = {}; renderAll(); break;
      case 'toggle': { const p = P(t.dataset.path); upd(p, !getIn(S.draft, p)); renderContent(); break; }
      case 'clear': upd(P(t.dataset.path), ''); renderContent(); break;
      case 'li-toggle': S.open[key + '.' + idx] = !S.open[key + '.' + idx]; renderContent(); break;
      case 'li-all': {
        const arr = listAt(key); const anyOpen = arr.some((_, i) => S.open[key + '.' + i]);
        arr.forEach((_, i) => { S.open[key + '.' + i] = !anyOpen; }); renderContent(); break;
      }
      case 'li-move': {
        const arr = listAt(key); const j = idx + Number(t.dataset.d);
        if (j < 0 || j >= arr.length) return;
        [arr[idx], arr[j]] = [arr[j], arr[idx]];
        upd(P(key), arr); S.open = {}; renderContent(); break;
      }
      case 'li-rm': {
        if (!window.confirm('ลบรายการนี้?')) return;
        const arr = listAt(key); arr.splice(idx, 1);
        upd(P(key), arr); S.open = {}; renderContent(); break;
      }
      case 'li-add': {
        const f = listDefs[key]; const arr = listAt(key);
        arr.push(f && f.blank ? f.blank() : {});
        upd(P(key), arr); S.open[key + '.' + (arr.length - 1)] = true; renderContent(); break;
      }
      case 'req-filter': S.reqFilter = key; renderContent(); break;
      case 'req-done': {
        const ref = t.dataset.ref;
        S.requests = S.requests.map(x => x.ref === ref ? { ...x, status: x.status === 'done' ? 'new' : 'done' } : x);
        renderAside(); renderContent(); CMS.saveRequests(S.requests); break;
      }
      case 'req-rm': {
        if (!window.confirm('ลบคำขอนี้?')) return;
        const ref = t.dataset.ref;
        S.requests = S.requests.filter(x => x.ref !== ref);
        renderAside(); renderContent(); CMS.saveRequests(S.requests); break;
      }
      case 'export': {
        toast('กำลังเตรียมไฟล์…');
        const blob = new Blob([JSON.stringify(await shrinkImages(S.draft), null, 2)], { type: 'application/json' });
        // named content.json so it can be dropped straight into web2/ of the repo
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'content.json'; a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000); break;
      }
      case 'reset':
        if (!window.confirm('คืนค่าเนื้อหาและรูปภาพทั้งหมดเป็นค่าเริ่มต้น?')) return;
        await CMS.reset(); S.draft = await CMS.load(); S.dirty = false; S.open = {}; renderAll(); toast('คืนค่าเริ่มต้นแล้ว'); break;
    }
  });

  // text fields: update the draft without re-rendering so focus and caret stay put
  app.addEventListener('input', e => {
    const el = e.target;
    if (!el.dataset || !el.dataset.path) return;
    upd(P(el.dataset.path), el.value);
    const li = el.closest('.li');
    if (li) {
      const f = listDefs[li.dataset.list]; const i = Number(li.dataset.idx);
      const title = li.querySelector('.li-title');
      if (f && title) title.textContent = itemTitle(f, getIn(S.draft, [...P(li.dataset.list), i]), i);
    }
  });

  app.addEventListener('change', async e => {
    const el = e.target;
    if (el.dataset && el.dataset.upload) {
      const file = el.files && el.files[0]; el.value = '';
      if (!file) return;
      const key = el.dataset.upload;
      S.busy = key; renderContent();
      try { upd(P(key), await fileToDataURL(file)); toast('อัปโหลดรูปแล้ว · กด “บันทึก” เพื่อเผยแพร่'); }
      catch (err) { toast('อัปโหลดรูปไม่สำเร็จ'); }
      S.busy = null; renderContent();
      if (key === 'logo') renderAside();
      return;
    }
    if (el.id === 'import-file') {
      const file = el.files && el.files[0]; el.value = ''; if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        try { S.draft = JSON.parse(r.result); S.dirty = true; S.open = {}; renderAll(); toast('นำเข้าแล้ว · กด “บันทึก” เพื่อเผยแพร่'); }
        catch (er) { toast('ไฟล์ไม่ถูกต้อง'); }
      };
      r.readAsText(file);
    }
  });

  app.addEventListener('submit', async e => {
    e.preventDefault();
    if (e.target.id === 'login-form') {
      const pw = document.getElementById('login-pw').value;
      const real = await CMS.getPassword();
      if (pw === real) { try { sessionStorage.setItem('kts-admin', '1'); } catch (er) {} S.authed = true; S.err = ''; renderAll(); }
      else { S.err = 'รหัสผ่านไม่ถูกต้อง'; renderAll(); }
    } else if (e.target.id === 'pw-form') {
      const cur = document.getElementById('pw-cur').value, nw = document.getElementById('pw-new').value;
      const real = await CMS.getPassword();
      if (cur !== real) { toast('รหัสผ่านปัจจุบันไม่ถูกต้อง'); return; }
      if ((nw || '').length < 6) { toast('รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัว'); return; }
      await CMS.setPassword(nw); e.target.reset(); toast('เปลี่ยนรหัสผ่านแล้ว');
    }
  });

  window.addEventListener('beforeunload', e => { if (S.dirty) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- boot ----------
  renderAll();
  CMS.load().then(c => {
    if (S.dirty) return;
    S.draft = c;
    if (S.authed) renderAll();
    else { const img = app.querySelector('.login img'); if (img) img.src = c.logo; } // don't wipe a half-typed password
  });
  loadRequests();
  CMS.subscribe(m => { if (m.type === 'requests') loadRequests(); });
})();
