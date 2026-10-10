(function () {
  const A = './assets/catalog/';
  const boat = (m, kind, o) => {
    const eng = kind === 'eng';
    const v = o.v ? 'หัวเรือวี ( V ) ' : '';
    return {
      id: `${m}-${kind}`, m, img: `${A}sk-${m}-${kind}.png`, hasEng: eng, mold: !!o.mold,
      len: o.len, w: o.w, h: o.h,
      line1: `${v}ขนาดความยาวเรือ ไม่น้อยกว่า ${o.len} เมตร ความกว้างเรือไม่น้อยกว่า ${o.w} เมตร`,
      line2: `ความสูงขอบด้านนอกไม่น้อยกว่า ${o.h} เมตร`,
      line3: eng ? `เครื่องยนต์แบบ OUTBOARD ไม่น้อยกว่า ${o.hp} HP จำนวน 1 เครื่องยนต์` : '(เฉพาะตัวเรือไม่มีเครื่องยนต์)',
      sub: (o.v ? 'หัวเรือวี · ' : '') + (eng ? `พร้อมเครื่องยนต์ OUTBOARD ${o.hp} HP` : 'เฉพาะตัวเรือไม่มีเครื่องยนต์'),
    };
  };
  const B = [
    ['T046', { len: '4.60', w: '1.60', h: '0.50', hp: 20, mold: true }],
    ['T054', { len: '5.40', w: '2.10', h: '0.63', hp: 30 }],
    ['T061', { len: '6.10', w: '2.30', h: '0.61', hp: 60 }],
    ['T064', { len: '6.40', w: '2.07', h: '0.62', hp: 60 }],
    ['T065', { len: '6.60', w: '2.35', h: '0.91', hp: 60, v: true }],
  ];
  const DEFAULTS = {
    logo: `${A}p1-1.png`,
    topbar: { text: 'ติดตามข่าวสารและสอบถาม' },
    nav: { home: 'หน้าแรก', about: 'เกี่ยวกับเรา', products: 'สินค้า', contact: 'ติดต่อเรา', quote: 'ขอใบเสนอราคา' },
    social: {
      facebookUrl: 'https://www.facebook.com/', facebookName: 'KTS Klang Technology Supply',
      lineUrl: 'https://line.me/R/ti/p/@kts-supply', lineId: '@kts-supply',
    },
    hero: {
      banner: './assets/kts-hero-banner-v2.png',
      bannerAlt: 'กั้นน้ำ ระบายน้ำ ช่วยเหลือและอพยพ ชาวบ้านที่กำลังประสบภัยน้ำท่วม',
      title: 'อุปกรณ์ฉุกเฉินช่วยเหลือน้ำท่วม สำหรับพื้นที่ประสบภัยน้ำท่วม',
      subtitle: 'เรือท้องแบนอลูมิเนียม กำแพงกั้นน้ำ และเครื่องสูบระบายน้ำเคลื่อนที่ แบบต่อสายลาก นวัตกรรมที่จะช่วยบรรเทาความเดือดร้อนพี่น้องประชาชน',
      ctaPrimary: 'ดูสินค้าทั้งหมด', ctaSecondary: 'ขอใบเสนอราคา',
    },
    pillars: [
      { img: './assets/kts-barrier.png', label: 'กั้นน้ำ', text: 'กำแพงกั้นน้ำ FLOODWALL พลาสติก ABS 3 รูปแบบ ต่อเป็นแนวยาวและแนวโค้งได้' },
      { img: './assets/kts-pump.png', label: 'ระบายน้ำ', text: 'เครื่องสูบระบายน้ำเคลื่อนที่ตีนตะขาบ สูบได้สูงสุด 4,000 ลบ.ม. ต่อชั่วโมง' },
      { img: './assets/kts-boat.png', label: 'ช่วยเหลือและอพยพ', text: 'เรือท้องแบนอลูมิเนียม SAKUN C Tiny Boat 5 รุ่น ยาว 4.60–6.60 เมตร' },
    ],
    about: {
      eyebrow: 'เกี่ยวกับเรา', title: 'เตรียมพร้อมวันนี้\nลดความสูญเสียเมื่อน้ำมา', img: '',
      body: 'บริษัท คลังเทคโนโลยีซัพพลาย จำกัด (KTS) จำหน่ายอุปกรณ์รับมืออุทกภัยให้หน่วยงานปกครองส่วนท้องถิ่น หน่วยกู้ภัย และองค์กรเอกชน ครอบคลุมทั้งการกั้นน้ำ ระบายน้ำ และช่วยเหลืออพยพ',
      steps: [
        { title: 'สำรวจความต้องการ', text: 'ประเมินพื้นที่เสี่ยงและจำนวนอุปกรณ์' },
        { title: 'เอกสารจัดซื้อ', text: 'ใบเสนอราคาและคุณลักษณะเฉพาะ' },
        { title: 'จัดส่งและติดตั้ง', text: 'ส่งถึงหน่วยงาน ตรวจรับพร้อมกัน' },
        { title: 'อบรมและดูแล', text: 'ฝึกใช้งาน และตรวจสภาพก่อนฤดูฝน' },
      ],
    },
    products: {
      eyebrow: 'รายละเอียดสินค้า', title: 'อุปกรณ์รับมืออุทกภัย',
      intro: 'เลือกรุ่นและจำนวนที่ต้องการ แล้วกด “ขอใบเสนอราคา” เจ้าหน้าที่จะส่งราคาและเอกสารคุณลักษณะเฉพาะให้',
    },
    boats: {
      tag: '01 · ช่วยเหลือและอพยพ', title: 'เรือท้องแบนอลูมิเนียม SAKUN C Tiny Boat', meta: '5 รุ่น · T046 · T054 · T061 · T064 · T065',
      name: 'เรือท้องแบนอลูมิเนียม SAKUN C Tiny Boat', unit: 'ลำ',
      moldLabel: 'มีแม่พิมพ์ขึ้นรูป', engLabel: 'พร้อมเครื่องยนต์ OUTBOARD', hullLabel: 'เฉพาะตัวเรือ ไม่มีเครื่องยนต์',
      items: B.flatMap(([m, o]) => [boat(m, 'hull', o), boat(m, 'eng', o)]),
    },
    floodwall: {
      tag: '03 · กั้นน้ำ', title: 'กำแพงกั้นน้ำ FLOODWALL', meta: 'แนวกั้นน้ำสำหรับเตรียมรับมืออุทกภัย · วัสดุพลาสติกเกรด ABS',
      name: 'กำแพงกั้นน้ำ FLOODWALL', unit: 'ชิ้น', specTitle: 'คุณลักษณะ', dimsTitle: 'ขนาด (Dimension) · น้ำหนัก',
      specs: [
        { k: 'ระดับความสูงที่ป้องกันน้ำท่วมได้', v: '730 mm' },
        { k: 'สามารถทำแนวโค้งได้', v: '2 องศา' },
        { k: 'วัสดุ', v: 'พลาสติกเกรด ABS' },
      ],
      items: [
        { id: 'FW-L', name: 'L-Shape', dim: '830 × 1,000 × 900 mm', kg: '9.6 kg', img: `${A}p4-0.png` },
        { id: 'FW-U', name: 'U-Shape', dim: '830 × 690 × 900 mm', kg: '6.4 kg', img: `${A}p4-1.png` },
        { id: 'FW-C', name: 'C-Shape', dim: '830 × 450 × 900 mm', kg: '6.1 kg', img: `${A}p4-2.png` },
      ],
    },
    pump: {
      tag: '02 · ระบายน้ำ', title: 'เครื่องสูบระบายน้ำเคลื่อนที่ แบบต่อสายลาก', meta: 'รุ่น C-QDLB-4000 · ตีนตะขาบ เหมาะกับพื้นที่โคลนและพื้นที่น้ำท่วม',
      img: `${A}p5-0.png`, name: 'เครื่องสูบระบายน้ำเคลื่อนที่ C-QDLB-4000', quoteSub: '4,000 m³/h · ตีนตะขาบ · พร้อมอุปกรณ์ประกอบ', unit: 'เครื่อง',
      stats: [
        { k: 'อัตราการสูบสูงสุด', v: '4,000 m³/h', sub: '4,000,000 ลิตร/ชม.' },
        { k: 'ความสูงส่งน้ำสูงสุด', v: '10 เมตร', sub: 'Max Head' },
      ],
      specs: [
        { k: 'ขนาดตัวเครื่อง (ย × ก × ส)', v: '3.50 × 2.00 × 1.50 เมตร' },
        { k: 'การเคลื่อนที่', v: 'Crawler / ตีนตะขาบ' },
        { k: 'Motor Pump Size', v: 'Electric 4 × 45 kW' },
        { k: 'ระบบควบคุม', v: 'สตาร์ทด้วย Variable Frequency / Inverter' },
      ],
      notePrefix: 'แนะนำใช้ร่วมกับ', noteStrong: 'Mobile Generator 350 kVA Prime / 385 kVA Standby', noteSuffix: '400 V, 3 Phase, 50 Hz',
      accTitle: 'อุปกรณ์ประกอบ',
      accessories: [
        { img: './assets/accessories/control-cabinet.png', title: 'ตู้ควบคุมการจ่ายกระแสไฟฟ้า', contain: true, bg: '#A0A0A1' },
        { img: './assets/accessories/cable-reel.png', title: 'ชุดม้วนสายเคเบิลไฟฟ้า 4 ชุด', contain: false, bg: '' },
        { img: './assets/accessories/hoses.png', title: 'สายส่งน้ำ 12 นิ้ว 4 เส้น พร้อมหัวต่อ เส้นละ 100 ม.', contain: false, bg: '' },
      ],
    },
    cta: { title: 'ต้องการราคาและเอกสารคุณลักษณะเฉพาะ?', text: 'กรอกรายละเอียดหน่วยงาน เจ้าหน้าที่จะส่งใบเสนอราคาภายใน 1 วันทำการ', button: 'ขอใบเสนอราคา' },
    quote: {
      eyebrow: 'ขอรายละเอียดใบเสนอราคา', title: 'แจ้งรายการและข้อมูลหน่วยงาน',
      intro: 'เจ้าหน้าที่จะส่งใบเสนอราคา พร้อมเอกสารคุณลักษณะเฉพาะสำหรับประกอบการจัดซื้อ ภายใน 1 วันทำการ',
      orgTypes: 'องค์การบริหารส่วนตำบล (อบต.)\nองค์การบริหารส่วนจังหวัด (อบจ.)\nเทศบาล\nหน่วยกู้ภัย / มูลนิธิ\nหน่วยงานราชการอื่น\nบริษัทเอกชน (บริจาค)',
      docs: 'ใบเสนอราคา\nคุณลักษณะเฉพาะ (สเปก)\nแคตตาล็อกสินค้า\nนัดสาธิตสินค้า',
      successTitle: 'ได้รับคำขอใบเสนอราคาแล้ว', successText: 'เจ้าหน้าที่ฝ่ายขายจะติดต่อกลับภายใน 1 วันทำการ',
    },
    contact: {
      company: 'บริษัท คลังเทคโนโลยีซัพพลาย จำกัด', address: '99 ถนนตัวอย่าง เขตตัวอย่าง กรุงเทพฯ 10000',
      phone: '02-000-0000', email: 'sales@kts.co.th', copyright: '© 2569 KLANG TECHNOLOGY SUPPLY CO., LTD.',
    },
  };

  const DB = 'kts-cms', STORE = 'kv';
  let dbp = null;
  const db = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  }));
  const get = async k => { const d = await db(); return new Promise((res, rej) => { const q = d.transaction(STORE).objectStore(STORE).get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); };
  const set = async (k, v) => { const d = await db(); return new Promise((res, rej) => { const tx = d.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(v, k); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); };
  const ch = 'BroadcastChannel' in window ? new BroadcastChannel('kts-cms') : null;
  const ping = type => { try { ch && ch.postMessage({ type }); } catch (e) {} };
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const merge = (d, v) => {
    if (v === undefined || v === null) return clone(d);
    if (!isObj(d) || !isObj(v)) return clone(v);
    const o = {};
    for (const k of new Set([...Object.keys(d), ...Object.keys(v)])) o[k] = k in d ? merge(d[k], v[k]) : clone(v[k]);
    return o;
  };
  const clone = o => o === undefined ? undefined : JSON.parse(JSON.stringify(o));

  window.KTSCMS = {
    DEFAULTS, clone,
    // Published content (content.json in the repo) is what every visitor sees; a newer local admin save wins on that browser only.
    async load() {
      let local = null, pub = null;
      try { local = await get('content'); } catch (e) {}
      try { const r = await fetch('./content.json', { cache: 'no-cache' }); if (r.ok) pub = await r.json(); } catch (e) {}
      const v = local && (!pub || (local.updatedAt || '') > (pub.updatedAt || '')) ? local : pub;
      return merge(DEFAULTS, v || {});
    },
    async save(c) { c.updatedAt = new Date().toISOString(); await set('content', clone(c)); ping('content'); return c.updatedAt; },
    async reset() { await set('content', null); ping('content'); },
    async listRequests() { try { return (await get('requests')) || []; } catch (e) { return []; } },
    async saveRequests(l) { await set('requests', l); ping('requests'); },
    async addRequest(r) { const l = await this.listRequests(); l.unshift(r); await this.saveRequests(l); },
    async getPassword() { try { return (await get('password')) || 'kts1234'; } catch (e) { return 'kts1234'; } },
    async setPassword(p) { await set('password', p); },
    subscribe(fn) { if (!ch) return () => {}; const h = e => fn(e.data || {}); ch.addEventListener('message', h); return () => ch.removeEventListener('message', h); },
  };
})();
