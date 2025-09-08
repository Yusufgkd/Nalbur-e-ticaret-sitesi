    const products = [
      { id: 'ckc', name: 'Çekiç (500g)', price: 189, category: 'El Aletleri', emoji: '🔨', stock: 24, tags: ['çelik', 'saplı', '500g'] },
      { id: 'trn', name: 'Tornavida Seti (6 Parça)', price: 259, category: 'El Aletleri', emoji: '🪛', stock: 18, tags: ['yıldız', 'düz', 'krom'] },
      { id: 'mtk', name: 'Akülü Matkap', price: 2190, category: 'Elektrikli Aletler', emoji: '🛠️', stock: 7, tags: ['18V', 'lityum', 'şarjlı'] },
      { id: 'olc', name: 'Çelik Metre (5m)', price: 129, category: 'Ölçüm', emoji: '📏', stock: 36, tags: ['5m', 'otomatik kilit'] },
      { id: 'vds', name: 'Vida Seti (200 Adet)', price: 149, category: 'Bağlantı Elemanları', emoji: '🧰', stock: 50, tags: ['ahşap', 'metal'] },
      { id: 'slk', name: 'Silikon Tabancası', price: 179, category: 'El Aletleri', emoji: '🧼', stock: 20, tags: ['profesyonel', 'standart'] },
      { id: 'boy', name: 'Boya Rulosu + Tepsi', price: 119, category: 'Yapı & Boya', emoji: '🎨', stock: 28, tags: ['duvar', 'tavan'] },
      { id: 'pns', name: 'Pense', price: 99, category: 'El Aletleri', emoji: '🔧', stock: 40, tags: ['izole', 'krom vanadyum'] },
    ];

    const state = {
      query: '',
      category: '',
      price: '',
      cart: loadCart(),
    };

    const els = {
      grid: document.getElementById('productGrid'),
      search: document.getElementById('searchInput'),
      category: document.getElementById('categorySelect'),
      price: document.getElementById('priceSelect'),
      chips: document.getElementById('activeChips'),
      resultCount: document.getElementById('resultCount'),
      themeToggle: document.getElementById('themeToggle'),
      cartBtn: document.getElementById('cartButton'),
      cartDrawer: document.getElementById('cartDrawer'),
      closeCart: document.getElementById('closeCart'),
      cartItems: document.getElementById('cartItems'),
      cartSubtotal: document.getElementById('cartSubtotal'),
      cartCount: document.getElementById('cartCount'),
      clearFilters: document.getElementById('clearFilters'),
      checkoutBtn: document.getElementById('checkoutBtn'),
    };

    // Theme
    function getStoredTheme() {
      try {
        return localStorage.getItem('nx_theme');
      } catch { return null; }
    }

    function storeTheme(theme) {
      try { localStorage.setItem('nx_theme', theme); } catch {}
    }

    function applyTheme(theme) {
      const root = document.documentElement;
      if (theme === 'light') {
        root.setAttribute('data-theme', 'light');
        if (els.themeToggle) els.themeToggle.textContent = '🌙';
        if (els.themeToggle) els.themeToggle.setAttribute('aria-label', 'Karanlık tema');
        if (els.themeToggle) els.themeToggle.title = 'Karanlık tema';
      } else {
        root.removeAttribute('data-theme');
        if (els.themeToggle) els.themeToggle.textContent = '☀️';
        if (els.themeToggle) els.themeToggle.setAttribute('aria-label', 'Aydınlık tema');
        if (els.themeToggle) els.themeToggle.title = 'Aydınlık tema';
      }
    }

    function initTheme() {
      const stored = getStoredTheme();
      if (stored) {
        applyTheme(stored);
        return stored;
      }
      const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
      const initial = prefersLight ? 'light' : 'dark';
      applyTheme(initial);
      return initial;
    }

    let currentTheme = initTheme();
    if (els.themeToggle) {
      els.themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        storeTheme(currentTheme);
      });
    }

    function formatPrice(value) { return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value); }

    function uniqueCategories(list) { return Array.from(new Set(list.map(p => p.category))); }

    function hydrateCategories() {
      const cats = uniqueCategories(products);
      for (const c of cats) {
        const opt = document.createElement('option');
        opt.value = c; opt.textContent = c; els.category.appendChild(opt);
      }
    }

    function applyFilters() {
      const q = state.query.toLowerCase().trim();
      let filtered = products.filter(p => {
        const inQuery = !q || p.name.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
        const inCat = !state.category || p.category === state.category;
        const inPrice = matchPrice(p.price, state.price);
        return inQuery && inCat && inPrice;
      });
      renderProducts(filtered);
      renderChips();
      els.resultCount.textContent = `${filtered.length} ürün`;
    }

    function matchPrice(price, rule) {
      if (!rule) return true;
      const [min, max] = rule.split('-');
      const minV = min ? parseFloat(min) : -Infinity;
      const maxV = max ? parseFloat(max) : Infinity;
      return price >= minV && price <= maxV;
    }

    function renderProducts(list) {
      els.grid.innerHTML = '';
      if (!list.length) {
        els.grid.innerHTML = `<div class="empty" style="grid-column: 1/-1;">Sonuç bulunamadı.</div>`;
        return;
      }
      const frag = document.createDocumentFragment();
      for (const p of list) {
        const card = document.createElement('article');
        card.className = 'card';
        card.innerHTML = `
          <div class="card-media">
            <span class="emoji" aria-hidden="true">${p.emoji}</span>
          </div>
          <div class="card-body">
            <div class="row"><span class="title">${p.name}</span> <span class="price-tag">${formatPrice(p.price)}</span></div>
            <div class="muted">${p.category}</div>
            <div class="row">
              <small class="muted">Stok: ${p.stock}</small>
              <button class="btn btn-primary" data-id="${p.id}">Sepete Ekle</button>
            </div>
          </div>`;
        frag.appendChild(card);
      }
      els.grid.appendChild(frag);

      els.grid.querySelectorAll('button[data-id]').forEach(btn => btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        addToCart(id);
      }));
    }

    function renderChips() {
      const chips = [];
      if (state.query) chips.push({ key: 'query', label: `Arama: "${state.query}"` });
      if (state.category) chips.push({ key: 'category', label: state.category });
      if (state.price) chips.push({ key: 'price', label: priceLabel(state.price) });
      els.chips.innerHTML = '';
      for (const c of chips) {
        const el = document.createElement('button');
        el.className = 'chip'; el.textContent = c.label; el.setAttribute('data-key', c.key);
        el.title = 'Kaldır';
        el.addEventListener('click', () => { removeChip(c.key); });
        els.chips.appendChild(el);
      }
    }

    function priceLabel(rule) {
      const map = { '0-250': '0–250 ₺', '250-500': '250–500 ₺', '500-1000': '500–1000 ₺', '1000-': '1000+ ₺' };
      return map[rule] || 'Fiyat';
    }

    function removeChip(key) {
      if (key === 'query') { state.query = ''; els.search.value = ''; }
      if (key === 'category') { state.category = ''; els.category.value = ''; }
      if (key === 'price') { state.price = ''; els.price.value = ''; }
      applyFilters();
    }

    // Cart
    function loadCart() {
      try {
        const raw = localStorage.getItem('nx_cart');
        return raw ? JSON.parse(raw) : {};
      } catch { return {}; }
    }
    function saveCart() { localStorage.setItem('nx_cart', JSON.stringify(state.cart)); }

    function addToCart(id) {
      const item = products.find(p => p.id === id);
      if (!item) return;
      const current = state.cart[id]?.qty || 0;
      state.cart[id] = { id, qty: Math.min(current + 1, item.stock) };
      saveCart();
      renderCart();
      pulseCart();
    }

    function changeQty(id, delta) {
      const item = products.find(p => p.id === id);
      const node = state.cart[id];
      if (!item || !node) return;
      node.qty = Math.max(0, Math.min(item.stock, node.qty + delta));
      if (node.qty === 0) delete state.cart[id];
      saveCart();
      renderCart();
    }

    function removeItem(id) {
      delete state.cart[id];
      saveCart();
      renderCart();
    }

    function renderCart() {
      const entries = Object.values(state.cart);
      els.cartItems.innerHTML = '';
      if (!entries.length) {
        els.cartItems.innerHTML = '<div class="empty">Sepetiniz boş.</div>';
        els.cartSubtotal.textContent = formatPrice(0);
        els.cartCount.textContent = '0';
        els.checkoutBtn.disabled = true;
        return;
      }
      const frag = document.createDocumentFragment();
      let subtotal = 0; let count = 0;
      for (const { id, qty } of entries) {
        const p = products.find(pr => pr.id === id);
        if (!p) continue;
        subtotal += p.price * qty; count += qty;
        const row = document.createElement('div');
        row.className = 'cart-item';
        row.innerHTML = `
          <div class="emoji" aria-hidden="true" style="font-size:22px;">${p.emoji}</div>
          <div>
            <div style="display:flex; justify-content:space-between; gap:8px;">
              <strong>${p.name}</strong>
              <span>${formatPrice(p.price)}</span>
            </div>
            <div class="muted">${p.category}</div>
          </div>
          <div style="display:grid; gap:6px; justify-items:end;">
            <div class="qty" role="group" aria-label="Adet">
              <button aria-label="Azalt" data-act="dec" data-id="${id}">−</button>
              <span aria-live="polite" style="min-width:18px; text-align:center;">${qty}</span>
              <button aria-label="Arttır" data-act="inc" data-id="${id}">+</button>
            </div>
            <button class="btn btn-ghost" data-act="rem" data-id="${id}">Kaldır</button>
          </div>`;
        frag.appendChild(row);
      }
      els.cartItems.appendChild(frag);
      els.cartSubtotal.textContent = formatPrice(subtotal);
      els.cartCount.textContent = String(count);
      els.checkoutBtn.disabled = subtotal <= 0;

      els.cartItems.querySelectorAll('button[data-id]').forEach(b => {
        b.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          const act = e.currentTarget.getAttribute('data-act');
          if (act === 'inc') changeQty(id, +1);
          if (act === 'dec') changeQty(id, -1);
          if (act === 'rem') removeItem(id);
        });
      });
    }

    function pulseCart() {
      els.cartBtn.style.transform = 'translateY(-2px)';
      setTimeout(() => { els.cartBtn.style.transform = ''; }, 120);
    }

    // Events
    els.search.addEventListener('input', (e) => { state.query = e.target.value; applyFilters(); });
    els.category.addEventListener('change', (e) => { state.category = e.target.value; applyFilters(); });
    els.price.addEventListener('change', (e) => { state.price = e.target.value; applyFilters(); });
    els.clearFilters.addEventListener('click', () => { state.query=''; state.category=''; state.price=''; els.search.value=''; els.category.value=''; els.price.value=''; applyFilters(); });

    els.cartBtn.addEventListener('click', () => { openDrawer(true); });
    els.closeCart.addEventListener('click', () => { openDrawer(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openDrawer(false); });

    function openDrawer(open) {
      els.cartDrawer.classList.toggle('open', open);
      els.cartBtn.setAttribute('aria-expanded', String(open));
    }

    // Init
    hydrateCategories();
    applyFilters();
    renderCart();