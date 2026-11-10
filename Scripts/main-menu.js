
document.addEventListener('DOMContentLoaded', function () {

    var toggleBtn = document.getElementById('navToggle');
    var headerInner = document.getElementById('headerInner');
    var overlay = document.getElementById('menuOverlay');

    // Kiểm tra các phần tử cần thiết
    if (!toggleBtn || !headerInner || !overlay) {
        console.error('Không tìm thấy phần tử menu trong Layout.');
        return;
    }

    // Hàm mở hoặc đóng menu
    function setMenu(open) {

        headerInner.classList.toggle('open', open);

        overlay.style.display = open ? 'block' : 'none';

        overlay.setAttribute('aria-hidden', String(!open));

        toggleBtn.setAttribute('aria-expanded', String(open));

        toggleBtn.setAttribute(
            'aria-label',
            open ? 'Đóng menu' : 'Mở menu'
        );

        toggleBtn.innerHTML = open ? '&#10005;' : '&#9776;';

        // Không cho cuộn nền khi menu mở
        document.body.style.overflow = open ? 'hidden' : '';
    }

    // Nhấn nút ☰ hoặc ✕
    toggleBtn.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        var isOpen = headerInner.classList.contains('open');

        setMenu(!isOpen);
    });

    // Nhấn lớp phủ tối để đóng menu
    overlay.addEventListener('click', function () {
        setMenu(false);
    });

    // Nhấn Escape để đóng menu
    document.addEventListener('keydown', function (e) {

        if (e.key === 'Escape') {
            setMenu(false);
        }
    });

    // Chuyển về giao diện máy tính thì đóng menu di động
    window.addEventListener('resize', function () {

        if (window.innerWidth > 1200) {
            setMenu(false);
        }
    });

});
