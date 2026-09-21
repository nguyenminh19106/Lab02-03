// Dữ liệu sản phẩm
const products = [
    { id: 1, name: "Sofa da cao cấp", price: 12500000, priceStr: "12,500,000₫", img: "assets/images/sofa.jpg", category: "sofa" },
    { id: 2, name: "Giường ngủ hiện đại", price: 9800000, priceStr: "9,800,000₫", img: "assets/images/giuong.jpg", category: "bed" },
    { id: 3, name: "Bàn ăn mặt đá tự nhiên", price: 5500000, priceStr: "5,500,000₫", img: "assets/images/ban.jpg", category: "dining" },
    { id: 4, name: "Kệ trang trí thông minh", price: 2800000, priceStr: "2,800,000₫", img: "assets/images/ke.jpg", category: "decor" },
    { id: 5, name: "Bàn trà mặt kính", price: 4200000, priceStr: "4,200,000₫", img: "assets/images/ban2.jpg", category: "sofa" },
    { id: 6, name: "Tủ quần áo 4 cánh", price: 15600000, priceStr: "15,600,000₫", img: "assets/images/tu.jpg", category: "bed" }
];

// ========== GIỎ HÀNG ==========
// Lấy giỏ hàng từ localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Lưu giỏ hàng vào localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Thêm sản phẩm vào giỏ hàng
window.addToCart = function(productId) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const product = products.find(p => p.id === productId);
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            priceStr: product.priceStr,
            img: product.img,
            quantity: 1
        });
    }
    
    saveCart(cart);
    alert('Đã thêm vào giỏ hàng!');
};

// Cập nhật số lượng sản phẩm trong giỏ
window.updateCartQuantity = function(productId, newQuantity) {
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        } else {
            item.quantity = newQuantity;
        }
        saveCart(cart);
        renderCartPage(); // Nếu đang ở trang giỏ hàng thì render lại
    }
};

// Xóa sản phẩm khỏi giỏ
window.removeFromCart = function(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    renderCartPage();
};

// Cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountSpan = document.getElementById('cartCount');
    if (cartCountSpan) {
        cartCountSpan.innerText = totalItems;
    }
}

// Format số tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + '₫';
}

// ========== DANH SÁCH YÊU THÍCH ==========
function getWishlist() {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
}

function saveWishlist(wishlist) {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishCount();
}

window.addToWishlist = function(productId) {
    let wishlist = getWishlist();
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        saveWishlist(wishlist);
        alert('Đã thêm vào danh sách yêu thích!');
    } else {
        alert('Sản phẩm đã có trong danh sách yêu thích!');
    }
};

function updateWishCount() {
    const wishlist = getWishlist();
    const wishCountSpan = document.getElementById('wishCount');
    if (wishCountSpan) {
        wishCountSpan.innerText = wishlist.length;
    }
}

// ========== RENDER SẢN PHẨM TRANG CHỦ ==========
function renderProducts(category = 'all', searchTerm = '') {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    let filtered = products;
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    if (searchTerm) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    grid.innerHTML = filtered.map(p => `
        <div class="product-card">
            <img src="${p.img}" alt="${p.name}">
            <h3>${p.name}</h3>
            <p class="price">${p.priceStr}</p>
            <button onclick="addToCart(${p.id})"><i class="fas fa-shopping-cart"></i> Thêm giỏ</button>
            <button onclick="addToWishlist(${p.id})"><i class="far fa-heart"></i> Yêu thích</button>
        </div>
    `).join('');
}

// ========== RENDER TRANG GIỎ HÀNG ==========
function renderCartPage() {
    const cartItemsList = document.getElementById('cartItemsList');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');
    
    if (!cartItemsList) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartItemsContainer) cartItemsContainer.style.display = 'none';
        return;
    }
    
    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartItemsContainer) cartItemsContainer.style.display = 'block';
    
    // Hiển thị danh sách sản phẩm
    cartItemsList.innerHTML = cart.map(item => `
        <tr>
            <td class="cart-product">
                <img src="${item.img}" alt="${item.name}" width="60">
                <span>${item.name}</span>
            </td>
            <td>${item.priceStr}</td>
            <td>
                <div class="quantity-control">
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td>${formatPrice(item.price * item.quantity)}</td>
            <td>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        </tr>
    `).join('');
    
    // Tính tổng tiền
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotalSpan) subtotalSpan.innerText = formatPrice(subtotal);
    if (totalSpan) totalSpan.innerText = formatPrice(subtotal);
}

// Thanh toán
window.checkout = function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Vui lòng đăng nhập để thanh toán!');
        window.location.href = 'login.html';
        return;
    }
    alert('Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.');
    localStorage.removeItem('cart');
    renderCartPage();
    updateCartCount();
};

// ========== BANNER SLIDESHOW ==========
let slideIndex = 0;
const slidesContainer = document.getElementById('slidesContainer');
const slides = document.querySelectorAll('.slide');

if (slidesContainer && slides.length) {
    function showSlide() {
        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
    }
    window.changeSlide = function(direction) {
        slideIndex += direction;
        if (slideIndex >= slides.length) slideIndex = 0;
        if (slideIndex < 0) slideIndex = slides.length - 1;
        showSlide();
    };
    setInterval(() => changeSlide(1), 5000);
}

// ========== REVIEW SLIDESHOW ==========
let reviewIndex = 0;
const reviewSlider = document.getElementById('reviewSlider');
const reviewCards = document.querySelectorAll('.review-card');

if (reviewSlider && reviewCards.length) {
    function updateReviewSlide() {
        reviewSlider.style.transform = `translateX(-${reviewIndex * 100}%)`;
    }
    
    document.getElementById('reviewPrev')?.addEventListener('click', () => {
        reviewIndex = (reviewIndex - 1 + reviewCards.length) % reviewCards.length;
        updateReviewSlide();
    });
    
    document.getElementById('reviewNext')?.addEventListener('click', () => {
        reviewIndex = (reviewIndex + 1) % reviewCards.length;
        updateReviewSlide();
    });
    
    setInterval(() => {
        reviewIndex = (reviewIndex + 1) % reviewCards.length;
        updateReviewSlide();
    }, 5000);
}

// ========== CATEGORY FILTER ==========
document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.cat;
        const searchTerm = document.getElementById('searchInput')?.value || '';
        renderProducts(category, searchTerm);
    });
});


document.getElementById('searchBtn')?.addEventListener('click', () => {
    const searchTerm = document.getElementById('searchInput').value;
    const activeCat = document.querySelector('.cat-btn.active')?.dataset.cat || 'all';
    renderProducts(activeCat, searchTerm);
});

document.getElementById('searchInput')?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = e.target.value;
        const activeCat = document.querySelector('.cat-btn.active')?.dataset.cat || 'all';
        renderProducts(activeCat, searchTerm);
    }
});

document.querySelectorAll('.dropdown-content a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.dataset.category;
        if (category) {
            document.querySelectorAll('.cat-btn').forEach(btn => {
                if (btn.dataset.cat === category) {
                    btn.click();
                }
            });
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    });
});

// ========== KHỞI TẠO ==========
updateCartCount();
updateWishCount();
renderProducts();

// Nếu đang ở trang giỏ hàng thì render giỏ hàng
if (window.location.pathname.includes('cart.html')) {
    renderCartPage();
}