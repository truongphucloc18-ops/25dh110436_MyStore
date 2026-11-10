
document.addEventListener('DOMContentLoaded', function () {

    var toastContainer = null;
    var toastTimer = null;
    var progressTimer = null;

    // ========================================
    // 1. TẠO CONTAINER THÔNG BÁO
    // ========================================
    function getToastContainer() {
        if (toastContainer && document.body.contains(toastContainer)) {
            return toastContainer;
        }

        toastContainer = document.createElement('div');
        toastContainer.id = 'custom-toast-container';

        toastContainer.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            z-index: 99999;
            width: min(360px, calc(100vw - 32px));
            pointer-events: none;
        `;

        document.body.appendChild(toastContainer);

        return toastContainer;
    }

    // ========================================
    // 2. HIỂN THỊ TOAST
    // ========================================
    function showTopRightNotification(message, isError) {
        var container = getToastContainer();

        // Hủy bộ đếm của thông báo trước
        clearTimeout(toastTimer);
        clearTimeout(progressTimer);

        // Xóa thông báo cũ nếu đang hiển thị
        container.replaceChildren();

        var toast = document.createElement('div');
        toast.className = 'custom-toast';

        toast.style.cssText = `
            position: relative;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            overflow: hidden;
            box-sizing: border-box;
            width: 100%;
            padding: 16px 18px 20px;
            background: #fff;
            color: #333;
            border-radius: 12px;
            border-left: 4px solid ${isError ? '#dc3545' : '#e53935'};
            box-shadow: 0 8px 28px rgba(0, 0, 0, 0.14);
            font-family: inherit;
            font-size: 14px;
            line-height: 1.5;
            opacity: 0;
            transform: translateX(24px);
            transition:
                opacity 0.25s ease,
                transform 0.3s ease;
            pointer-events: auto;
        `;

        // Biểu tượng trạng thái
        var icon = document.createElement('div');
        icon.textContent = isError ? '✕' : '✓';

        icon.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: ${isError ? '#fde8ea' : '#fde8e7'};
            color: ${isError ? '#dc3545' : '#e53935'};
            font-size: 20px;
            font-weight: 700;
        `;

        // Nội dung thông báo
        var content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            min-width: 0;
            overflow-wrap: anywhere;
        `;

        var title = document.createElement('div');
        title.textContent = isError ? 'Có lỗi xảy ra' : 'Thành công';
        title.style.cssText = `
            font-weight: 700;
            margin-bottom: 2px;
            color: ${isError ? '#dc3545' : '#c62828'};
        `;

        var description = document.createElement('div');
        description.textContent = message;
        description.style.color = '#555';

        content.appendChild(title);
        content.appendChild(description);

        // Nút đóng thông báo
        var closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = '×';
        closeButton.setAttribute('aria-label', 'Đóng thông báo');

        closeButton.style.cssText = `
            border: 0;
            background: transparent;
            color: #888;
            font-size: 22px;
            line-height: 1;
            padding: 0 0 0 4px;
            cursor: pointer;
        `;

        // Thanh tiến trình
        var progressTrack = document.createElement('div');
        progressTrack.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: #f1f1f1;
        `;

        var progressBar = document.createElement('div');
        progressBar.style.cssText = `
            width: 100%;
            height: 100%;
            background: ${isError ? '#dc3545' : '#e53935'};
            transform-origin: left;
            transform: scaleX(1);
        `;

        progressTrack.appendChild(progressBar);

        toast.appendChild(icon);
        toast.appendChild(content);
        toast.appendChild(closeButton);
        toast.appendChild(progressTrack);

        container.appendChild(toast);

        var dismissed = false;

        function dismissToast() {
            if (dismissed) return;
            dismissed = true;

            clearTimeout(toastTimer);
            clearTimeout(progressTimer);

            toast.style.opacity = '0';
            toast.style.transform = 'translateX(24px)';

            setTimeout(function () {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }

        closeButton.addEventListener('click', dismissToast);

        // Kích hoạt hiệu ứng sau khi trình duyệt nhận diện trạng thái ban đầu
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';

                progressBar.style.transition = 'transform 3s linear';
                progressBar.style.transform = 'scaleX(0)';
            });
        });

        // Tự động đóng sau 3 giây
        toastTimer = setTimeout(dismissToast, 3000);
    }

    // ========================================
    // 3. XỬ LÝ THÊM MÓN VÀO GIỎ HÀNG
    // ========================================
    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.btn-add-cart');

        if (!btn) return;

        e.preventDefault();

        // Tránh gửi nhiều request từ cùng một nút
        if (btn.dataset.loading === 'true') return;

        var productId = btn.getAttribute('data-id');

        if (!productId || !window.cartAddToCartUrl) {
            showTopRightNotification(
                'Không tìm thấy thông tin món ăn hoặc địa chỉ xử lý.',
                true
            );
            return;
        }

        btn.dataset.loading = 'true';
        btn.setAttribute('aria-busy', 'true');

        fetch(window.cartAddToCartUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'id=' + encodeURIComponent(productId) + '&quantity=1'
        })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('HTTP ' + res.status);
                }

                return res.json();
            })
            .then(function (data) {
                if (data && data.success) {
                    var cartCountElem = document.getElementById('cart-count');

                    if (cartCountElem) {
                        cartCountElem.textContent = data.cartCount;
                    }

                    showTopRightNotification(
                        'Đã thêm món vào giỏ hàng thành công!',
                        false
                    );
                } else {
                    showTopRightNotification(
                        data && data.message
                            ? data.message
                            : 'Không thể thêm món vào giỏ hàng.',
                        true
                    );
                }
            })
            .catch(function () {
                showTopRightNotification(
                    'Kết nối thất bại. Vui lòng thử lại!',
                    true
                );
            })
            .finally(function () {
                btn.dataset.loading = 'false';
                btn.removeAttribute('aria-busy');
            });
    });

});
