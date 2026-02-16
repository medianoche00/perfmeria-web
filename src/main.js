
        // ==========================================
        // 📱 CONFIGURACIÓN DE WHATSAPP
        // ==========================================
        const WHATSAPP_NUMBER = '51923580692';
        
        // ==========================================
        // 🛒 SISTEMA DE CARRITO / COTIZACIÓN
        // ==========================================
        let cart = [];

        function toggleNav() {
            document.getElementById('mainNav').classList.toggle('active');
        }

        function toggleCart() {
            document.getElementById('cartOverlay').classList.toggle('active');
            document.getElementById('cartSidebar').classList.toggle('active');
        }

function addToCart(name, brand, price, size, category, image) { // Añadimos 'image'
    const existingIndex = cart.findIndex(item => 
        item.name === name && item.size === size
    );

    if (existingIndex !== -1) {
        cart[existingIndex].quantity++;
    } else {
        const item = {
            id: Date.now(),
            name: name,
            brand: brand,
            price: price,
            size: size,
            category: category,
            image: image, // Guardamos la ruta de la imagen
            quantity: 1
        };
        cart.push(item);
    }

    updateCart();
    showToast(`${name} (${size}) agregado a la cotización`);
}

        function removeFromCart(id) {
                    cart = cart.filter(item => item.id !== id);
                    updateCart();
                }

        function updateQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(id);
                } else {
                    updateCart();
                }
            }
        }

                function clearCart() {
            if (cart.length === 0) return;
            if (confirm('¿Estás seguro de vaciar la cotización?')) {
                cart = [];
                updateCart();
                showToast('Cotización vaciada');
            }
        }

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const totalItems = document.getElementById('totalItems');
    const totalDecants = document.getElementById('totalDecants');
    const checkoutBtn = document.getElementById('checkoutBtn');

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = itemCount;
    totalItems.textContent = cart.length + ' diferentes';
    totalDecants.textContent = itemCount + ' unidades';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Tu cotización está vacía</p>
                <span>Agrega productos para comenzar</span>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: contain;">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-brand">${item.brand}</div>
                    <div class="cart-item-name">${item.name}</div>
                    <span class="cart-item-size">${item.size}</span>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <div class="cart-item-price">S/ ${(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        checkoutBtn.disabled = false;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `S/ ${total.toFixed(2)}`;
}

        function showToast(message) {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            toastMessage.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // ==========================================
        // 📲 FUNCIONES DE WHATSAPP
        // ==========================================
        
        // Enviar cotización completa
        function sendWhatsApp() {
            if (cart.length === 0) {
                alert('Tu cotización está vacía');
                return;
            }

            let message = `🛍️ *COTIZACIÓN - DELUXE PERFUMERÍA*\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
            message += `¡Hola! Me gustaría solicitar la siguiente cotización:\n\n`;

            const hombre = cart.filter(item => item.category === 'hombre');
            const mujer = cart.filter(item => item.category === 'mujer');

            if (hombre.length > 0) {
                message += `👔 *PERFUMES HOMBRE:*\n`;
                hombre.forEach(item => {
                    message += `   • ${item.name} (${item.brand})\n`;
                    message += `     📦 ${item.size} x ${item.quantity} = S/ ${(item.price * item.quantity).toFixed(2)}\n`;
                });
                message += `\n`;
            }

            if (mujer.length > 0) {
                message += `👗 *PERFUMES MUJER:*\n`;
                mujer.forEach(item => {
                    message += `   • ${item.name} (${item.brand})\n`;
                    message += `     📦 ${item.size} x ${item.quantity} = S/ ${(item.price * item.quantity).toFixed(2)}\n`;
                });
                message += `\n`;
            }

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            message += `━━━━━━━━━━━━━━━━━━━━━\n`;
            message += `📊 *RESUMEN:*\n`;
            message += `   • Total de decants: ${totalItems}\n`;
            message += `   • Productos diferentes: ${cart.length}\n`;
            message += `\n`;
            message += `💰 *TOTAL: S/ ${total.toFixed(2)}*\n`;
            message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
            message += `Por favor, confirmen disponibilidad y forma de pago. ¡Gracias! 🙏`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Consultar disponibilidad de un producto
        function consultarDisponibilidad(name, brand) {
            const message = `¡Hola! 👋

Me interesa el perfume *${name}* de *${brand}*.

¿Todavía tienen disponible? 🤔

Me gustaría saber:
• ¿Tienen en 10ml y 30ml?
• ¿Cuánto tiempo demora el envío?

¡Gracias! 🙏`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // Notificar cuando un producto agotado vuelva a estar disponible
        function notificarRestock(name, brand) {
            const message = `¡Hola! 👋

Vi que el perfume *${name}* de *${brand}* está agotado 😔

¿Podrían avisarme cuando vuelva a estar disponible?

¡Gracias! 🙏`;

            const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }

        // ==========================================
        // 🔗 NAVEGACIÓN SUAVE
        // ==========================================
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
                document.getElementById('mainNav').classList.remove('active');
            });
        });

        // Inicializar
        updateCart();
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.toggleNav = toggleNav;
window.toggleCart = toggleCart;
window.sendWhatsApp = sendWhatsApp;

document.addEventListener("click", (e) => {

   if(e.target.id === "clear-cart"){
        clearCart();
   }

});

