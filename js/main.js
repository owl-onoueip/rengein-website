//===============================================================
// debounce関数
//===============================================================
function debounce(func, wait) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            func.apply(context, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

//===============================================================
// スライドショー
//===============================================================
$(function () {
    var slides = $('#mainimg .slide');
    var slideCount = slides.length;
    var currentIndex = 0;

    slides.eq(currentIndex).css('opacity', 1).addClass('active');

    setInterval(function () {
        var nextIndex = (currentIndex + 1) % slideCount;
        slides.eq(currentIndex).css('opacity', 0).removeClass('active');
        slides.eq(nextIndex).css('opacity', 1).addClass('active');
        currentIndex = nextIndex;
    }, 5000);
});

//===============================================================
// スクロール関連
//===============================================================

// ページの上部へ戻るボタンの表示/非表示
$(window).scroll(debounce(function () {
    if ($(this).scrollTop() > 100) {
        $('.pagetop').fadeIn();
    } else {
        $('.pagetop').fadeOut();
    }
}, 200));

// ページの上部へ戻るボタンをクリックした時の動作
$('.pagetop').click(function () {
    $('body,html').animate({
        scrollTop: 0
    }, 500);
    return false;
});

