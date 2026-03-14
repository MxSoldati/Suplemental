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

    // State
    let currentBrandFilter = 'all';
    let currentCategoryFilter = 'all';
    const productStates = {}; // e.g. { 'star-whey': { size: '2 lbs', flavor: 'Vainilla' } }

    // --- View Navigation Logic ---
    function switchView(targetView, activeLink = null, bypassAnimation = false) {
        views.forEach(v => v.classList.remove('active'));
        navLinks.forEach(l => l?.classList.remove('active'));
        if (activeLink) activeLink.classList.add('active');

        // Save state
        localStorage.setItem('currentView', targetView.id);

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

    linkHome?.addEventListener('click', (e) => {
        e.preventDefault();
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
                <a href="https://wa.me/5492613645154?text=Hola,%20quiero%20consultar%20por%20el%20${encodeURIComponent(obj.combo.name)}" target="_blank" rel="noopener noreferrer" class="btn-cta">
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

        const flavorsHtml = (allFlavors.length > 1 || allFlavors[0] !== 'Único') ? `
            <div class="selector-group">
                <span class="selector-label">Sabor:</span>
                ${allFlavors.map(flavor => {
                    const isActive = flavor === state.flavor;
                    // Check if this flavor exists for the currently selected size
                    const isAvailableWithCurrentSize = product.variants.some(v => v.size === state.size && v.flavor === flavor);
                    const disabledClass = !isAvailableWithCurrentSize ? 'disabled' : '';
                    return `<button class="chip chip-flavor ${isActive ? 'active' : ''} ${disabledClass}" data-value="${flavor}">${flavor}</button>`;
                }).join('')}
            </div>
        ` : '';

        const msg = `Hola Suplemental! Me gustaría comprar ${currentVariant.originalName} (Código: ${currentVariant.code}), ¿cómo proseguimos?`;
        const waLink = `https://wa.me/5492613645154?text=${encodeURIComponent(msg)}`;

        return `
            <div class="product-img-wrapper" style="overflow: hidden; border-radius: var(--radius-sm) var(--radius-sm) 0 0;">
                <img src="${getProductImage(product.category, currentVariant)}" alt="${product.name}" class="product-photo img-appear" loading="lazy">
            </div>
            <div class="product-info">
                <p class="brand">${product.brand}</p>
                <h3>${product.name}</h3>
                
                <div class="variant-selectors">
                    ${sizesHtml}
                    ${flavorsHtml}
                </div>
                
                <p class="variant-name">${currentVariant.originalName}</p>
                <p class="price">${formatPrice(currentVariant.price)}</p>
                
                <a href="${waLink}" class="btn-buy" target="_blank">Comprar por WhatsApp</a>
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

    // Event Delegation for Variant Chips
    catalogGrid.addEventListener('click', (e) => {
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
    const savedView = localStorage.getItem('currentView');
    const savedObjective = localStorage.getItem('currentObjective');

    if (savedView === 'view-objective' && savedObjective) {
        dynamicContentArea.innerHTML = buildObjectiveHTML(savedObjective);
        switchView(viewObjective, null, true);
    } else if (savedView === 'view-products') {
        switchView(viewProducts, linkProducts, true);
    } else {
        // Default to home but ensure content is rendered if needed
        switchView(viewHome, linkHome, true);
    }

    // Always render products in background so it's ready unconditionally
    if (catalogGrid.children.length === 0) {
        renderProducts();
    }

});
