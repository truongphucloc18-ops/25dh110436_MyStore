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

    // Tính ngay khi người dùng nhập số lượng
    quantityInputs.forEach(function (input) {
        input.addEventListener('input', updateCartTotal);
        input.addEventListener('change', updateCartTotal);
    });

});

