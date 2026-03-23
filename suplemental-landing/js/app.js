document.addEventListener('DOMContentLoaded', () => {

    // DOM Elements - Navigation & Views
    const linkHome = document.getElementById('link-home');
    const linkProducts = document.getElementById('link-products');
    const viewHome = document.getElementById('view-home');
    const viewObjective = document.getElementById('view-objective');
    const viewProducts = document.getElementById('view-products');
    const views = [viewHome, viewObjective, viewProducts];
    const navLinks = [linkHome, linkProducts];

    // DOM Elements - Objectives
    const dynamicContentArea = document.getElementById('objective-dynamic-content');
    const backBtn = document.getElementById('btn-back');
    const objectiveCards = document.querySelectorAll('.card-objective');

    // DOM Elements - Products Catalog
    const catalogGrid = document.getElementById('catalog-grid');
    const brandFilters = document.querySelectorAll('#brand-filters .filter-btn');
    const categoryFilters = document.querySelectorAll('#category-filters .filter-btn');

    // DOM Elements - Cart
    const cartToggleBtn = document.getElementById('cart-toggle-btn');
    const cartDrawer = document.getElementById('cart-drawer');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBadge = document.getElementById('cart-badge');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalEl = document.getElementById('cart-total');
    const btnCheckout = document.getElementById('btn-checkout');

    // State
    let currentBrandFilter = 'all';
    let currentCategoryFilter = 'all';
    const productStates = {}; // e.g. { 'star-whey': { size: '2 lbs', flavor: 'Vainilla' } }
    let cart = []; // Array to store cart items

    // --- Custom Dropdown Logic ---
    const brandDropdown = document.getElementById('brand-dropdown');
    const categoryDropdown = document.getElementById('category-dropdown');
    const brandValueEl = document.getElementById('brand-value');
    const categoryValueEl = document.getElementById('category-value');

    function setupDropdown(dropdownEl, valueEl, filterGroup, onSelect) {
        const toggle = dropdownEl.querySelector('.dropdown-toggle');
        const menu = dropdownEl.querySelector('.dropdown-menu');
        const items = menu.querySelectorAll('.dropdown-item');

        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other dropdowns
            document.querySelectorAll('.custom-dropdown.open').forEach(d => {
                if (d !== dropdownEl) d.classList.remove('open');
            });
            dropdownEl.classList.toggle('open');
        });

        items.forEach(item => {
            item.addEventListener('click', () => {
                const val = item.getAttribute('data-filter');
                // Update active state
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                // Update displayed value
                const imgEl = item.querySelector('img');
                valueEl.textContent = imgEl ? imgEl.getAttribute('alt') : (item.querySelector('span')?.textContent || val);
                // Close the dropdown
                dropdownEl.classList.remove('open');
                // Sync with hidden filter buttons and trigger render
                onSelect(val);
            });
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown.open').forEach(d => d.classList.remove('open'));
    });

    setupDropdown(brandDropdown, brandValueEl, 'brand', (val) => {
        currentBrandFilter = val;
        renderProducts();
    });

    setupDropdown(categoryDropdown, categoryValueEl, 'category', (val) => {
        currentCategoryFilter = val;
        renderProducts();
    });

    // --- View Navigation Logic ---
    function switchView(targetView, activeLink = null, bypassAnimation = false, pushHistory = true) {
        views.forEach(v => v.classList.remove('active'));
        navLinks.forEach(l => l?.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');

        // Save state
        localStorage.setItem('currentView', targetView.id);

        // Push a history entry so the back gesture/button works
        if (pushHistory) {
            const objective = localStorage.getItem('currentObjective') || null;
            history.pushState({ viewId: targetView.id, objective }, '', location.href.split('#')[0]);
        }

        if (bypassAnimation) {
            targetView.classList.add('active');
            if (targetView === viewProducts && catalogGrid.children.length === 0) {
                renderProducts();
            }
        } else {
            setTimeout(() => {
                targetView.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                if (targetView === viewProducts && catalogGrid.children.length === 0) {
                    renderProducts();
                }
            }, 150);
        }
    }

    // Handle browser back/forward gestures
    window.addEventListener('popstate', (e) => {
        const state = e.state;
        if (!state || state.viewId === 'view-home') {
            // Volver al inicio
            localStorage.removeItem('currentObjective');
            localStorage.setItem('currentView', 'view-home');
            views.forEach(v => v.classList.remove('active'));
            navLinks.forEach(l => l?.classList.remove('active'));
            linkHome?.classList.add('active');
            viewHome.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (state.viewId === 'view-objective' && state.objective) {
            localStorage.setItem('currentObjective', state.objective);
            dynamicContentArea.innerHTML = buildObjectiveHTML(state.objective);
            views.forEach(v => v.classList.remove('active'));
            navLinks.forEach(l => l?.classList.remove('active'));
            viewObjective.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (state.viewId === 'view-products') {
            views.forEach(v => v.classList.remove('active'));
            navLinks.forEach(l => l?.classList.remove('active'));
            linkProducts?.classList.add('active');
            viewProducts.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    linkHome?.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('currentObjective');
        switchView(viewHome, linkHome);
    });

    document.getElementById('logo-home-btn')?.addEventListener('click', () => {
        localStorage.removeItem('currentObjective');
        switchView(viewHome, linkHome);
    });

    linkProducts?.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(viewProducts, linkProducts);
    });
    
    document.getElementById('btn-view-all')?.addEventListener('click', (e) => {
        e.preventDefault();
        switchView(viewProducts, linkProducts);
    });

    backBtn?.addEventListener('click', () => {
        localStorage.removeItem('currentObjective');
        switchView(viewHome, linkHome);
    });

    // --- Objectives Logic ---
    function buildObjectiveHTML(dataKey) {
        const obj = objectivesData[dataKey];
        if (!obj) return "<p>Objetivo no encontrado.</p>";

        const supplementsHTML = obj.supplements.map(sup => `
            <li class="sup-item">
                <strong>✓ ${sup.name}:</strong> ${sup.description}
            </li>
        `).join('');

        return `
            <div class="objective-header">
                <h2>${obj.title}</h2>
            </div>
            <div class="objective-problem">
                <p><strong>El problema:</strong> ${obj.problem}</p>
            </div>
            <div class="objective-offer">
                <h3>¿Qué suplementos ayudan a esto?</h3>
                <ul class="sup-list">
                    ${supplementsHTML}
                </ul>
            </div>
            <div class="objective-combo">
                <div class="combo-badge">Combo Recomendado</div>
                <h3>${obj.combo.name}</h3>
                <p class="combo-desc"><strong>Incluye:</strong> ${obj.combo.desc}</p>
                <p class="combo-explanation">${obj.combo.explanation}</p>
                <a href="https://wa.me/5492615126087?text=${encodeURIComponent(`¡Hola, equipo de Suplemental! 👋 Estoy interesado en el *${obj.combo.name}*. ¿Me podrían brindar más información al respecto? ¡Muchas gracias!`)}" target="_blank" rel="noopener noreferrer" class="btn-cta">
                    Quiero este combo
                </a>
            </div>
        `;
    }

    objectiveCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const target = card.getAttribute('data-target');
            localStorage.setItem('currentObjective', target);
            dynamicContentArea.innerHTML = buildObjectiveHTML(target);
            switchView(viewObjective, null); 
        });
    });

    // --- Products Catalog Logic ---
    
    const formatPrice = (price) => {
        if (!price) return 'Consultar precio';
        return '$' + price.toLocaleString('es-AR');
    };

    const getProductImage = (category, currentVariant) => {
        if (currentVariant && currentVariant.image) {
            return currentVariant.image;
        }
        const imgMap = {
            'proteina': 'img-imp/whey_protein.jpg',
            'creatina': 'img-imp/creatina.png',
            'salud': 'img-imp/resveratrol.webp',
            'accesorios': 'img-imp/botella.webp'
        };
        return imgMap[category] || 'img-imp/whey_protein.jpg';
    };

    function buildProductCardInner(product) {
        const state = productStates[product.id];
        
        // Find current variant
        let currentVariant = product.variants.find(v => v.size === state.size && v.flavor === state.flavor);
        if (!currentVariant) {
            currentVariant = product.variants[0];
            state.size = currentVariant.size;
            state.flavor = currentVariant.flavor;
        }
        
        const allSizes = [...new Set(product.variants.map(v => v.size))];
        const allFlavors = [...new Set(product.variants.map(v => v.flavor))];
        
        const sizesHtml = (allSizes.length > 1 || allSizes[0] !== 'Único') ? `
            <div class="selector-group">
                <span class="selector-label">Tamaño:</span>
                ${allSizes.map(size => {
                    const isActive = size === state.size;
                    return `<button class="chip chip-size ${isActive ? 'active' : ''}" data-value="${size}">${size}</button>`;
                }).join('')}
            </div>
        ` : '';

        const flavorColors = {
            'Vainilla': '#f3e5ab', // Pastel yellow
            'Chocolate': '#7b3f00', // Chocolate brown
            'Cookies': '#d2b48c', // Tan/cookies
            'Frutilla': '#ffb6c1', // Light pink
            'Neutro': '#e2e2e2',  // Light gray
            'Frutos Rojos': '#ff4040', // Red
            'Limón': '#fffacd', // Lemon chiffon
            'Sandía': '#ff7f50', // Coral/watermelon
            'Acai': '#8a2be2', // Purple
            'Uva': '#9370db', // Medium purple
            'Melón': '#98fb98' // Pale green
        };

        const flavorsHtml = (allFlavors.length > 1 || allFlavors[0] !== 'Único') ? `
            <div class="selector-group">
                <span class="selector-label">Sabor:</span>
                ${allFlavors.map(flavor => {
                    const isActive = flavor === state.flavor;
                    // Check if this flavor exists for the currently selected size
                    const isAvailableWithCurrentSize = product.variants.some(v => v.size === state.size && v.flavor === flavor);
                    const disabledClass = !isAvailableWithCurrentSize ? 'disabled' : '';
                    
                    const color = flavorColors[flavor] || 'transparent';
                    const borderStyle = isActive ? '' : `border-bottom: 3px solid ${color};`;
                    const shadowStyle = isActive ? `box-shadow: 0 0 10px ${color}80; background-color: ${color}20; border-color: ${color}; color: ${color === '#e2e2e2' || color === '#f3e5ab' || color === '#fffacd' ? 'var(--text-main)' : color};` : '';
                    
                    return `<button class="chip chip-flavor ${isActive ? 'active' : ''} ${disabledClass}" data-value="${flavor}" style="${borderStyle} ${shadowStyle}">${flavor}</button>`;
                }).join('')}
            </div>
        ` : '';

        return `
            <div class="product-img-wrapper" style="overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0;">
                <img src="${getProductImage(product.category, currentVariant)}" alt="${product.name}" class="product-photo img-appear" loading="lazy">
            </div>
            <div class="product-info">
                <img src="img/Logos/logo sup.webp" alt="" class="card-brand-logo" aria-hidden="true">
                <p class="brand">${product.brand}</p>
                <h3>${product.name}</h3>
                
                <div class="variant-selectors">
                    ${sizesHtml}
                    ${flavorsHtml}
                </div>
                
                <p class="variant-name">${currentVariant.originalName}</p>
                <p class="price">${formatPrice(currentVariant.price)}</p>
                
                <button class="btn-buy btn-add-cart">Agregar al Carrito</button>
            </div>
        `;
    }

    function renderProducts() {
        catalogGrid.innerHTML = ''; 

        const filteredProducts = productsData.filter(product => {
            const matchBrand = currentBrandFilter === 'all' || product.brand === currentBrandFilter;
            const matchCategory = currentCategoryFilter === 'all' || product.category === currentCategoryFilter;
            return matchBrand && matchCategory;
        });

        if (filteredProducts.length === 0) {
            catalogGrid.innerHTML = `<div class="no-results">No se encontraron productos con estos filtros.</div>`;
            return;
        }

        const html = filteredProducts.map(product => {
            if (!productStates[product.id]) {
                const defaultVariant = product.variants[0];
                productStates[product.id] = { 
                    size: defaultVariant.size, 
                    flavor: defaultVariant.flavor 
                };
            }
            return `<div class="product-card grouped" data-id="${product.id}">
                ${buildProductCardInner(product)}
            </div>`;
        }).join('');

        catalogGrid.innerHTML = html;

        if (filteredProducts.length === 1) {
            catalogGrid.classList.add('single-product');
        } else {
            catalogGrid.classList.remove('single-product');
        }
    }

    // Event Delegation for Variant Chips and Add to Cart
    function handleProductCardClick(e) {
        const btnAdd = e.target.closest('.btn-add-cart');
        if (btnAdd) {
            const card = btnAdd.closest('.product-card');
            const productId = card.getAttribute('data-id');
            const product = productsData.find(p => p.id === productId);
            const state = productStates[productId];
            const currentVariant = product.variants.find(v => v.size === state.size && v.flavor === state.flavor) || product.variants[0];
            const img = getProductImage(product.category, currentVariant);
            
            addToCart(product, currentVariant, img);
            return;
        }

        const chip = e.target.closest('.chip');
        if (!chip || chip.classList.contains('disabled')) return;
        
        const card = chip.closest('.product-card');
        const productId = card.getAttribute('data-id');
        const product = productsData.find(p => p.id === productId);
        const state = productStates[productId];
        let needsUpdate = false;
        
        if (chip.classList.contains('chip-size')) {
            const newSize = chip.getAttribute('data-value');
            if (state.size !== newSize) {
                state.size = newSize;
                const availableFlavors = product.variants.filter(v => v.size === newSize).map(v => v.flavor);
                if (!availableFlavors.includes(state.flavor)) {
                    state.flavor = availableFlavors[0]; 
                }
                needsUpdate = true;
            }
        } else if (chip.classList.contains('chip-flavor')) {
            const newFlavor = chip.getAttribute('data-value');
            if (state.flavor !== newFlavor) {
                state.flavor = newFlavor;
                needsUpdate = true;
            }
        }

        if (needsUpdate) {
            card.innerHTML = buildProductCardInner(product);
        }
    }

    catalogGrid.addEventListener('click', handleProductCardClick);

    // --- Cart Logic ---
    function openCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartToggleBtn?.addEventListener('click', openCart);
    closeCartBtn?.addEventListener('click', closeCart);
    cartOverlay?.addEventListener('click', closeCart);

    function updateCartBadge() {
        if (!cartBadge) return;
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        if (totalItems > 0) {
            cartBadge.textContent = totalItems;
            cartBadge.style.display = 'flex';
        } else {
            cartBadge.style.display = 'none';
        }
    }

    function renderCart() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="cart-empty">
                    <p>Tu carrito está vacío.</p>
                    <button class="btn-cta btn-small" id="btn-start-shopping-empty">Ver productos</button>
                </div>
            `;
            document.getElementById('btn-start-shopping-empty')?.addEventListener('click', () => {
                closeCart();
                switchView(viewProducts, linkProducts);
            });
            if(cartTotalEl) cartTotalEl.textContent = '$0';
            if(btnCheckout) btnCheckout.disabled = true;
            updateCartBadge();
            return;
        }

        let total = 0;
        let html = '';

        cart.forEach((item, index) => {
            const itemTotal = item.variant.price ? (item.variant.price * item.quantity) : 0;
            total += itemTotal;
            
            const priceDisplay = item.variant.price 
                ? `$${item.variant.price.toLocaleString('es-AR')}` 
                : '<span class="cart-item-price no-price">Consultar</span>';

            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.product.name}" class="cart-item-img">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.product.name}</div>
                        <div class="cart-item-variant">${item.variant.size} - ${item.variant.flavor}</div>
                        <div class="cart-item-price-row">
                            <div class="qty-controls">
                                <button class="qty-btn qty-btn-minus" data-index="${index}">-</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn qty-btn-plus" data-index="${index}">+</button>
                            </div>
                            <div class="cart-item-price">${priceDisplay}</div>
                        </div>
                    </div>
                    <button class="remove-item-btn" data-index="${index}" aria-label="Eliminar item">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            `;
        });

        cartItemsContainer.innerHTML = html;
        if(cartTotalEl) cartTotalEl.textContent = total > 0 ? `$${total.toLocaleString('es-AR')}` : 'A consultar';
        if(btnCheckout) btnCheckout.disabled = false;
        updateCartBadge();

        cartItemsContainer.querySelectorAll('.qty-btn-minus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.getAttribute('data-index')), -1));
        });
        cartItemsContainer.querySelectorAll('.qty-btn-plus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(parseInt(btn.getAttribute('data-index')), 1));
        });
        cartItemsContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.getAttribute('data-index'))));
        });
    }

    function addToCart(product, variant, image) {
        const existingItemIndex = cart.findIndex(item => item.product.id === product.id && item.variant.code === variant.code);
        
        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push({
                product: product,
                variant: variant,
                image: image,
                quantity: 1
            });
        }
        
        renderCart();
        openCart();
    }

    function updateQuantity(index, change) {
        if (cart[index]) {
            cart[index].quantity += change;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
            renderCart();
        }
    }

    function removeFromCart(index) {
        if (cart[index]) {
            cart.splice(index, 1);
            renderCart();
        }
    }

    btnCheckout?.addEventListener('click', () => {
        if (cart.length === 0) return;

        let message = `¡Hola, equipo de Suplemental! 👋\nQuiero realizar el siguiente pedido:\n\n`;
        let total = 0;
        let hasUnpricedItem = false;

        cart.forEach(item => {
            const priceVal = item.variant.price ? item.variant.price * item.quantity : 0;
            total += priceVal;
            if (!item.variant.price) hasUnpricedItem = true;

            const priceStr = item.variant.price ? `$${priceVal.toLocaleString('es-AR')}` : `A consultar`;
            message += `- ${item.quantity}x ${item.variant.originalName} (${priceStr})\n`;
        });

        message += `\n`;
        message += `*Total estimado:* ${total > 0 ? '$' + total.toLocaleString('es-AR') : ''} ${hasUnpricedItem ? '(+ productos a consultar)' : ''}\n\n`;
        message += `¿Me podrían brindar más información sobre los medios de pago y el envío? ¡Muchas gracias!`;

        const waLink = `https://wa.me/5492615126087?text=${encodeURIComponent(message)}`;
        window.open(waLink, '_blank');
    });

    // Filter Listeners
    brandFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            brandFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentBrandFilter = btn.getAttribute('data-filter');
            renderProducts();
        });
    });

    categoryFilters.forEach(btn => {
        btn.addEventListener('click', (e) => {
            categoryFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategoryFilter = btn.getAttribute('data-filter');
            renderProducts();
        });
    });

    // --- Initialization based on localStorage ---
    // Seed the history stack with the home state so 'back' always has somewhere to go
    history.replaceState({ viewId: 'view-home', objective: null }, '', location.href.split('#')[0]);

    const savedView = localStorage.getItem('currentView');
    const savedObjective = localStorage.getItem('currentObjective');

    if (savedView === 'view-objective' && savedObjective) {
        dynamicContentArea.innerHTML = buildObjectiveHTML(savedObjective);
        switchView(viewObjective, null, true);
    } else if (savedView === 'view-products') {
        switchView(viewProducts, linkProducts, true);
    } else {
        // Default to home but ensure content is rendered if needed
        switchView(viewHome, linkHome, true, false);
    }

    // Always render products in background so it's ready unconditionally
    if (catalogGrid.children.length === 0) {
        renderProducts();
    }

    // Dynamic rendering of the Showcase Products on Home page
    const showcaseGrid = document.querySelector('.products-showcase .products-grid');
    if (showcaseGrid) {
        const showcaseIds = ['star-whey', 'star-creatina', 'star-resveratrol', 'star-botella'];
        const showcaseProducts = showcaseIds.map(id => productsData.find(p => p.id === id)).filter(Boolean);
        showcaseGrid.innerHTML = showcaseProducts.map(product => {
            if (!productStates[product.id]) {
                const defaultVariant = product.variants[0];
                productStates[product.id] = { size: defaultVariant.size, flavor: defaultVariant.flavor };
            }
            return `<div class="product-card grouped" data-id="${product.id}">
                ${buildProductCardInner(product)}
            </div>`;
        }).join('');
        
        // Attach the same listener so it delegates appropriately
        showcaseGrid.addEventListener('click', handleProductCardClick);
    }

    // Initial cart render to handle early listeners
    renderCart();

});
