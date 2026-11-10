
document.addEventListener('DOMContentLoaded', function () {

    var modal = document.getElementById('deleteCartModal');
var productNameElement = document.getElementById('deleteProductName');
var confirmButton = document.getElementById('confirmDeleteCart');

if (!modal || !productNameElement || !confirmButton) {
        return;
    }

var deleteUrl = '';
var previousFocus = null;
var isDeleting = false;

function openModal(button) {
        if (isDeleting) return;

deleteUrl = button.getAttribute('data-delete-url');
productNameElement.textContent =
button.getAttribute('data-product-name') || 'món ăn';

previousFocus = button;

modal.classList.add('is-visible');
modal.setAttribute('aria-hidden', 'false');

document.body.classList.add('delete-modal-open');

confirmButton.disabled = false;
confirmButton.querySelector('span').textContent = 'Xóa món';

confirmButton.focus();
    }

function closeModal() {
        if (isDeleting) return;

modal.classList.remove('is-visible');
modal.setAttribute('aria-hidden', 'true');

document.body.classList.remove('delete-modal-open');

deleteUrl = '';

if (previousFocus && document.contains(previousFocus)) {
    previousFocus.focus();
        }
    }

// Mở modal khi bấm nút Xóa
document.addEventListener('click', function (event) {
        var button = event.target.closest('.btn-delete-item');

if (button) {
    event.preventDefault();
openModal(button);
return;
        }

// Đóng modal khi bấm nền hoặc nút đóng/hủy
if (event.target.closest('[data-close-modal]')) {
    closeModal();
        }
    });

// Đóng modal bằng phím Escape
document.addEventListener('keydown', function (event) {
        if (
event.key === 'Escape' &&
modal.classList.contains('is-visible')
) {
    closeModal();
        }
    });

// Xác nhận xóa
confirmButton.addEventListener('click', function () {
        if (!deleteUrl || isDeleting) return;

isDeleting = true;

confirmButton.disabled = true;
confirmButton.querySelector('span').textContent = 'Đang xóa...';

// Điều hướng đến action RemoveFromCart hiện có
window.location.href = deleteUrl;
    });

});


