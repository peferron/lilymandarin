(function() {
    //
    // Avoid sudden background resize on mobile browsers when the address bar is hidden.
    //

    var homeTop = document.getElementsByClassName('home__top')[0];
    var windowWidth;

    function onWindowResize() {
        if (window.innerWidth !== windowWidth) {
            windowWidth = window.innerWidth;
            homeTop.style.height = window.innerHeight + 'px';
        }
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    //
    // Fade tagline arrow when scrolling.
    //

    function getScrollRatio() {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        var clientHeight = document.documentElement.clientHeight;
        return scrollTop / (scrollHeight - clientHeight);
    }

    var homeTaglineArrow = document.getElementsByClassName('home__tagline__arrow')[0]
    function updateTaglineArrow() {
        var scrollRatio = getScrollRatio();

        var heightEm = (1 - scrollRatio * 2) * 1.2;
        var normalizedHeightEm = Math.max(0, Math.min(1.2, heightEm));
        homeTaglineArrow.style.height = normalizedHeightEm + 'em';

        var opacity = 1 - scrollRatio * 8;
        var normalizedOpacity = Math.max(0, Math.min(1, opacity));
        homeTaglineArrow.style.opacity = normalizedOpacity;
    }
    updateTaglineArrow();

    var waitingForAnimationFrame = false;
    window.addEventListener('scroll', function() {
        if (!waitingForAnimationFrame) {
            waitingForAnimationFrame = true;
            requestAnimationFrame(function() {
                updateTaglineArrow();
                waitingForAnimationFrame = false;
            });
        }
    });
}());
