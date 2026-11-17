/* Tổng tiền = GT1*SL1 + GT2*SL2 + ... + GTn*SLn */

document.addEventListener('DOMContentLoaded', function () {

    var quantityInputs = document.querySelectorAll('.qty-input');
    var subtotalElements = document.querySelectorAll('.cart-subtotal');
    var totalElements = document.querySelectorAll('.cart-total');

    // Định dạng tiền Việt Nam
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            maximumFractionDigits: 0
        }).format(amount) + ' ₫';
    }

    // Tính lại thành tiền và tổng tiền
    function updateCartTotal() {
        var grandTotal = 0;

        quantityInputs.forEach(function (input) {

            var row = input.closest('tr');

            if (!row) return;

            // Lấy đơn giá từ data-price
            var price = Number(input.dataset.price) || 0;

            // Lấy số lượng hiện tại
            var quantity = parseInt(input.value, 10);

            // Không cho số lượng nhỏ hơn 1
            if (!Number.isFinite(quantity) || quantity < 1) {
                quantity = 1;
                input.value = 1;
            }

            // Thành tiền của món hiện tại
            var lineTotal = price * quantity;

            // Cập nhật thành tiền trong bảng
            var lineTotalElement = row.querySelector('.cart-item-total');

            if (lineTotalElement) {
                lineTotalElement.textContent = formatCurrency(lineTotal);
            }

            // Cộng dồn tổng tiền giỏ hàng
            grandTotal += lineTotal;
        });

        // Cập nhật tạm tính
        subtotalElements.forEach(function (element) {
            element.textContent = formatCurrency(grandTotal);
        });

        // Cập nhật tổng cộng
        totalElements.forEach(function (element) {
            element.textContent = formatCurrency(grandTotal);
        });
    }

    // Địa chỉ cập nhật số lượng (được khai báo trong Cart/Index.cshtml)
    var updateUrl = window.cartUpdateQuantityUrl || '/Cart/UpdateQuantity';

    // Các request lưu số lượng đang chạy (để chờ xong rồi mới chuyển trang)
    var pendingRequests = [];

    // Gửi số lượng mới của 1 món lên server (lưu vào Session)
    function saveQuantity(input) {
        var productId = input.dataset.productId;
        var quantity = parseInt(input.value, 10);

        if (!Number.isFinite(quantity) || quantity < 1) {
            quantity = 1;
            input.value = 1;
        }

        var request = fetch(updateUrl, {
            method: 'POST',
            credentials: 'same-origin',   // bắt buộc gửi cookie Session
            keepalive: true,              // không bị hủy khi trang đang chuyển đi
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'id=' + encodeURIComponent(productId) +
                '&quantity=' + encodeURIComponent(quantity)
        }).then(function (res) {
            if (!res.ok) {
                throw new Error('HTTP ' + res.status);
            }
            return res.json();
        });

        pendingRequests.push(request);

        // Gỡ khỏi danh sách khi đã xong (dù thành công hay lỗi)
        var cleanup = function () {
            var index = pendingRequests.indexOf(request);
            if (index !== -1) pendingRequests.splice(index, 1);
        };
        request.then(cleanup, cleanup);

        return request;
    }

    // Tính ngay khi người dùng nhập số lượng
    quantityInputs.forEach(function (input) {
        input.addEventListener('input', updateCartTotal);
        input.addEventListener('change', function () {
            updateCartTotal();
            saveQuantity(input).catch(function () { /* sẽ được lưu lại khi bấm Đặt hàng */ });
        });
    });

    // Bấm "TIẾN HÀNH ĐẶT HÀNG": lưu xong số lượng của tất cả món rồi mới chuyển trang
    var checkoutLink = document.querySelector('.btn-checkout-custom[href]');

    if (checkoutLink && quantityInputs.length > 0) {
        checkoutLink.addEventListener('click', function (event) {
            if (event.button !== 0 || event.ctrlKey || event.metaKey ||
                event.shiftKey || event.altKey) return;

            event.preventDefault();

            if (checkoutLink.dataset.saving === 'true') return;
            checkoutLink.dataset.saving = 'true';

            var url = checkoutLink.href;

            // Gửi lại số lượng hiện tại của mọi món
            var requests = Array.prototype.map.call(quantityInputs, saveQuantity);

            Promise.all(requests.concat(pendingRequests))
                .then(function () {
                    window.location.href = url;
                })
                .catch(function () {
                    checkoutLink.dataset.saving = 'false';
                    alert('Không thể cập nhật số lượng. Vui lòng thử lại!');
                });
        });
    }

});