document.addEventListener("DOMContentLoaded", function () {
    // Chọn tất cả các thẻ món ăn dù nằm ở trang chủ hay trang thực đơn
    const productCards = document.querySelectorAll('.product-grid .product-card, .product-grid-custom .product-card');

    productCards.forEach((card, index) => {
        // Mỗi món ăn sẽ bắt đầu xuất hiện cách (0.07 giây)
        const delay = index * 0.07;
        card.style.animationDelay = `${delay}s`;
    });
});
