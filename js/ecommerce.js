// js/ecommerce.js - Estilo Mercado Libre con Fake Store API
export class Ecommerce {
    constructor() {
        this.allProducts = [];
        this.cart = [];
        this.currentCategory = 'all';
        this.renderUI();
        this.loadProducts();
    }

    renderUI() {
        const card = document.getElementById('card-ecommerce');
        if (!card) return;
        card.innerHTML = `
            <h2>🛒 E-commerce - Mercado Libre Style</h2>
            <div class="ml-search-bar">
                <input type="text" id="mlSearchInput" placeholder="Buscar productos, marcas y más..." class="ml-search-input">
                <button class="btn btn-small" id="mlSearchBtn">🔍 Buscar</button>
            </div>
            <div class="ml-categories" id="mlCategories">
                <button class="ml-cat-btn active" data-cat="all">Todos</button>
            </div>
            <div class="ml-toolbar">
                <span id="mlResultCount" class="ml-result-count">Cargando...</span>
                <select id="mlSort" class="ml-sort-select">
                    <option value="default">Ordenar por</option>
                    <option value="price-asc">Menor precio</option>
                    <option value="price-desc">Mayor precio</option>
                    <option value="rating">Mejor calificados</option>
                </select>
            </div>
            <div id="mlProductGrid" class="ml-product-grid">
                <div class="ml-loading"><div class="loading"></div><p>Cargando productos...</p></div>
            </div>
            <div class="ml-cart-bar" id="mlCartBar" style="display:none;">
                🛒 <span id="mlCartCount">0</span> producto(s) —
                <strong>$<span id="mlCartTotal">0.00</span></strong>
                <button class="ml-cart-btn" id="mlCartBtn">Ver carrito</button>
            </div>
            <!-- Modal producto -->
            <div class="ml-modal-overlay" id="mlModalOverlay">
                <div class="ml-modal">
                    <button class="ml-modal-close" id="mlModalClose">✕</button>
                    <div id="mlModalContent"></div>
                </div>
            </div>
            <!-- Modal carrito -->
            <div class="ml-modal-overlay" id="mlCartOverlay">
                <div class="ml-modal">
                    <button class="ml-modal-close" id="mlCartClose">✕</button>
                    <h3 style="margin-bottom:15px;color:#667eea;">🛒 Tu carrito</h3>
                    <div id="mlCartItems"></div>
                    <div id="mlCartFooter"></div>
                </div>
            </div>
        `;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('mlSearchBtn').addEventListener('click', () => this.applyFilters());
        document.getElementById('mlSearchInput').addEventListener('keyup', e => {
            if (e.key === 'Enter') this.applyFilters();
        });
        document.getElementById('mlSort').addEventListener('change', () => this.applyFilters());
        document.getElementById('mlCartBtn').addEventListener('click', () => this.openCartModal());
        document.getElementById('mlModalClose').addEventListener('click', () =>
            document.getElementById('mlModalOverlay').classList.remove('active'));
        document.getElementById('mlCartClose').addEventListener('click', () =>
            document.getElementById('mlCartOverlay').classList.remove('active'));
        ['mlModalOverlay','mlCartOverlay'].forEach(id => {
            document.getElementById(id).addEventListener('click', e => {
                if (e.target.id === id) e.target.classList.remove('active');
            });
        });
    }

    async loadProducts() {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            this.allProducts = await res.json();
            this.renderCategories();
            this.renderProducts(this.allProducts);
        } catch {
            document.getElementById('mlProductGrid').innerHTML =
                '<p class="error-message">❌ Error al cargar productos.</p>';
        }
    }

    renderCategories() {
        const cats = ['all', ...new Set(this.allProducts.map(p => p.category))];
        const container = document.getElementById('mlCategories');
        container.innerHTML = cats.map(cat => `
            <button class="ml-cat-btn ${cat==='all'?'active':''}" data-cat="${cat}">
                ${cat==='all'?'Todos':this.capitalize(cat)}
            </button>`).join('');
        container.querySelectorAll('.ml-cat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.ml-cat-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.cat;
                this.applyFilters();
            });
        });
    }

    renderProducts(products) {
        const grid = document.getElementById('mlProductGrid');
        document.getElementById('mlResultCount').textContent =
            `${products.length} resultado${products.length!==1?'s':''}`;
        if (products.length === 0) {
            grid.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Sin resultados</p>';
            return;
        }
        grid.innerHTML = products.map(p => `
            <div class="ml-product-item" data-id="${p.id}">
                <div class="ml-product-img-wrap">
                    <img src="${p.image}" alt="${p.title}" class="ml-product-img" loading="lazy">
                </div>
                <div class="ml-product-info">
                    <p class="ml-product-title">${p.title}</p>
                    <div class="ml-product-rating">
                        <span class="ml-stars">${this.stars(p.rating.rate)}</span>
                        <span class="ml-rating-count">(${p.rating.count})</span>
                    </div>
                    <p class="ml-product-price">$${p.price.toFixed(2)}</p>
                    <span class="ml-free-ship">✅ Envío gratis</span>
                    <button class="ml-add-cart btn btn-small" data-id="${p.id}">+ Agregar</button>
                </div>
            </div>`).join('');

        grid.querySelectorAll('.ml-product-item').forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.classList.contains('ml-add-cart')) return;
                this.openProductModal(parseInt(item.dataset.id));
            });
        });
        grid.querySelectorAll('.ml-add-cart').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                this.addToCart(parseInt(btn.dataset.id));
            });
        });
    }

    applyFilters() {
        const query = document.getElementById('mlSearchInput').value.toLowerCase();
        const sort  = document.getElementById('mlSort').value;
        let filtered = this.allProducts.filter(p => {
            const matchCat = this.currentCategory==='all' || p.category===this.currentCategory;
            const matchQ   = p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query);
            return matchCat && matchQ;
        });
        if (sort==='price-asc')  filtered.sort((a,b) => a.price - b.price);
        if (sort==='price-desc') filtered.sort((a,b) => b.price - a.price);
        if (sort==='rating')     filtered.sort((a,b) => b.rating.rate - a.rating.rate);
        this.renderProducts(filtered);
    }

    openProductModal(id) {
        const p = this.allProducts.find(p => p.id===id);
        if (!p) return;
        document.getElementById('mlModalContent').innerHTML = `
            <div class="ml-detail">
                <img src="${p.image}" alt="${p.title}" class="ml-detail-img">
                <div class="ml-detail-info">
                    <span class="ml-detail-cat">${this.capitalize(p.category)}</span>
                    <h3 class="ml-detail-title">${p.title}</h3>
                    <div class="ml-product-rating" style="margin:8px 0">
                        <span class="ml-stars">${this.stars(p.rating.rate)}</span>
                        <span class="ml-rating-count">${p.rating.rate}/5 (${p.rating.count} reseñas)</span>
                    </div>
                    <p class="ml-detail-price">$${p.price.toFixed(2)}</p>
                    <span class="ml-free-ship">✅ Envío gratis</span>
                    <p class="ml-detail-desc">${p.description}</p>
                    <button class="btn" id="modalAddBtn">🛒 Agregar al carrito</button>
                </div>
            </div>`;
        document.getElementById('mlModalOverlay').classList.add('active');
        document.getElementById('modalAddBtn').addEventListener('click', () => {
            this.addToCart(p.id);
            document.getElementById('mlModalOverlay').classList.remove('active');
        });
    }

    addToCart(id) {
        const product = this.allProducts.find(p => p.id===id);
        if (!product) return;
        const existing = this.cart.find(i => i.id===id);
        existing ? existing.qty++ : this.cart.push({...product, qty:1});
        this.updateCartBar();
        this.showNotification(`🛒 "${product.title.substring(0,30)}..." agregado`);
    }

    updateCartBar() {
        const totalItems = this.cart.reduce((s,i) => s+i.qty, 0);
        const totalPrice = this.cart.reduce((s,i) => s+i.price*i.qty, 0);
        document.getElementById('mlCartCount').textContent = totalItems;
        document.getElementById('mlCartTotal').textContent = totalPrice.toFixed(2);
        document.getElementById('mlCartBar').style.display = totalItems>0 ? 'flex' : 'none';
    }

    openCartModal() {
        const container = document.getElementById('mlCartItems');
        const footer    = document.getElementById('mlCartFooter');
        if (this.cart.length===0) {
            container.innerHTML = '<p style="text-align:center;color:#999;padding:20px;">Tu carrito está vacío</p>';
            footer.innerHTML = '';
        } else {
            container.innerHTML = this.cart.map(item => `
                <div class="ml-cart-item">
                    <img src="${item.image}" class="ml-cart-item-img" alt="${item.title}">
                    <div class="ml-cart-item-info">
                        <p class="ml-cart-item-title">${item.title}</p>
                        <p class="ml-cart-item-price">$${item.price.toFixed(2)} c/u</p>
                        <div class="ml-qty-control">
                            <button class="ml-qty-btn" data-action="minus" data-id="${item.id}">−</button>
                            <span>${item.qty}</span>
                            <button class="ml-qty-btn" data-action="plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="ml-cart-item-total">
                        <strong>$${(item.price*item.qty).toFixed(2)}</strong>
                        <button class="ml-remove-btn" data-id="${item.id}">🗑️</button>
                    </div>
                </div>`).join('');
            const total = this.cart.reduce((s,i) => s+i.price*i.qty, 0);
            footer.innerHTML = `
                <div class="ml-cart-total-row">
                    <span>Total:</span><strong>$${total.toFixed(2)}</strong>
                </div>
                <button class="btn" id="checkoutBtn" style="width:100%;margin-top:10px;">💳 Comprar ahora</button>`;

            container.querySelectorAll('.ml-qty-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const item = this.cart.find(i => i.id===parseInt(btn.dataset.id));
                    if (!item) return;
                    item.qty += btn.dataset.action==='plus' ? 1 : -1;
                    if (item.qty<=0) this.cart = this.cart.filter(i => i.id!==parseInt(btn.dataset.id));
                    this.updateCartBar();
                    this.openCartModal();
                });
            });
            container.querySelectorAll('.ml-remove-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.cart = this.cart.filter(i => i.id!==parseInt(btn.dataset.id));
                    this.updateCartBar();
                    this.openCartModal();
                });
            });
            document.getElementById('checkoutBtn').addEventListener('click', () => {
                document.getElementById('mlCartOverlay').classList.remove('active');
                this.cart = [];
                this.updateCartBar();
                this.showNotification('✅ ¡Compra realizada con éxito!');
            });
        }
        document.getElementById('mlCartOverlay').classList.add('active');
    }

    stars(rate) {
        const full = Math.round(rate);
        return '★'.repeat(full) + '☆'.repeat(5-full);
    }

    capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }

    showNotification(msg) {
        const n = document.createElement('div');
        n.className = 'notification';
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 3000);
    }
}