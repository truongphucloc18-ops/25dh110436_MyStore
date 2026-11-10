(function () {
    var loader = document.getElementById('page-loader');

    if (!loader) return;

    var timer = null;
    var hideTimer = null;
    var progress = 0;

    function startLoading() {
        clearInterval(timer);
        clearTimeout(hideTimer);

        progress = 0;
        loader.style.transition = 'none';
        loader.style.width = '0%';
        loader.style.opacity = '1';

        // Buộc trình duyệt áp dụng trạng thái ban đầu
        loader.offsetWidth;

        loader.style.transition = 'width 0.3s ease, opacity 0.3s ease';

        progress = 8;
        loader.style.width = progress + '%';

        timer = setInterval(function () {
            if (progress < 90) {
                progress += Math.max(0.5, (90 - progress) * 0.08);
                loader.style.width = progress + '%';
            }
        }, 100);
    }

    function finishLoading() {
        clearInterval(timer);

        loader.style.opacity = '1';
        loader.style.width = '100%';

        hideTimer = setTimeout(function () {
            loader.style.opacity = '0';

            setTimeout(function () {
                loader.style.width = '0%';
            }, 250);
        }, 150);
    }

    // Nếu vừa chuyển từ trang khác đến đây
    var pending = sessionStorage.getItem('page-loader-pending');

    if (pending === '1') {
        sessionStorage.removeItem('page-loader-pending');

        // Trang mới bắt đầu với thanh đã tiến một phần
        progress = 75;
        loader.style.transition = 'none';
        loader.style.width = '75%';
        loader.style.opacity = '1';
        loader.offsetWidth;
        loader.style.transition = 'width 0.2s ease, opacity 0.2s ease';

        timer = setInterval(function () {
            if (progress < 90) {
                progress += Math.max(0.5, (90 - progress) * 0.08);
                loader.style.width = progress + '%';
            }
        }, 100);
    }

    // Bắt sự kiện nhấn liên kết chuyển trang
    document.addEventListener('click', function (event) {
        var link = event.target.closest('a');

        if (!link || event.button !== 0) return;

        if (event.ctrlKey || event.metaKey ||
            event.shiftKey || event.altKey) return;

        if (link.target && link.target !== '_self') return;
        if (link.hasAttribute('download')) return;

        var url;

        try {
            url = new URL(link.href, window.location.href);
        } catch (error) {
            return;
        }

        if (url.origin !== window.location.origin) return;

        // Bỏ qua liên kết chỉ đổi vị trí trong cùng trang
        if (url.pathname === window.location.pathname &&
            url.search === window.location.search &&
            url.hash) return;

        if (url.href === window.location.href) return;

        // Ghi nhớ để trang mới biết cần hiện thanh
        sessionStorage.setItem('page-loader-pending', '1');

        startLoading();
    });

    // Trang tải hoàn tất
    window.addEventListener('load', function () {
        if (sessionStorage.getItem('page-loader-pending') === '1') {
            sessionStorage.removeItem('page-loader-pending');
        }

        finishLoading();
    });

    // Quay lại trang bằng nút Back/Forward
    window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
            clearInterval(timer);
            clearTimeout(hideTimer);
            loader.style.transition = 'none';
            loader.style.width = '0%';
            loader.style.opacity = '0';
        }
    });
})();


