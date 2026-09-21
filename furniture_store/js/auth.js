// Kiểm tra trạng thái đăng nhập và cập nhật Header
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    const authSection = document.getElementById('authSection');
    if (!authSection) return;

    if (isLoggedIn && user) {
        authSection.innerHTML = `
            <div class="user-info">
                <i class="fas fa-user-circle"></i>
                <span class="user-name">Xin chào, ${user.fullname}</span>
                <a href="#" id="logoutBtn" class="logout-link">(Đăng xuất)</a>
            </div>
        `;
        // Gắn sự kiện đăng xuất
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                alert('Đã đăng xuất!');
                window.location.href = 'index.html';
            });
        }
    } else {
        // Chưa đăng nhập: hiển thị nút Đăng nhập
        authSection.innerHTML = `<a href="login.html" class="login-icon"><i class="far fa-user"></i><span>Đăng nhập</span></a>`;
    }
}

// Chạy khi trang load
document.addEventListener('DOMContentLoaded', updateAuthUI);