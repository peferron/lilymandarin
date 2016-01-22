(function() {
    //
    // Avoid sudden background resize on mobile browsers when the address bar is hidden.
    //

    var homeTop = document.querySelector('.home__top');
    var windowHeightIndicator = document.querySelector('.home__window-height-indicator');
    var previousWindowWidth;

    function onWindowResize() {
        // On Android, window.innerHeight deltas during scrolling because the toolbars become
        // hidden. To prevent a jarring resize, we only update the height if the width has also
        // deltad, i.e. the device was flipped between portrait and landscape.
        if (previousWindowWidth === window.innerWidth) {
            return;
        }
        previousWindowWidth = window.innerWidth;

        // iOS issue: when the DOM loaded event is sent, window.innerHeight is bigger than the
        // real window height because it does not account for the toolbar height.
        // A workaround is to use a setInterval or requestAnimationFrame, but it still causes
        // some visual jarring because the first frame shown does not have the correct height.
        // A better workaround, used here, is to get the height of a fixed element instead.
        homeTop.style.height = windowHeightIndicator.clientHeight + 'px';
    }

    window.addEventListener('resize', onWindowResize);
    onWindowResize();

    //
    // Blur high-res background.
    //

    var bg = document.querySelector('.home__background--high-res');
    var bgImage = getComputedStyle(bg).backgroundImage;
    var bgImageUrl = /(?:\(['|"]?)(.*?)(?:['|"]?\))/.exec(bgImage)[1];

    var img = new Image();
    img.addEventListener('load', function() {
        bg.className += ' home__background--high-res--loaded';
    });
    img.src = bgImageUrl;

    //
    // Fade tagline arrow when scrolling.
    //

    var homeBottom = document.querySelector('.home__bottom');
    function getHomeBottomScrollToY() {
        return Math.min(
            document.documentElement.scrollTop + homeBottom.getBoundingClientRect().top,
            document.documentElement.scrollHeight - windowHeightIndicator.clientHeight
        );
    }

    var homeTaglineArrow = document.querySelector('.home__tagline__arrow');
    function updateTaglineArrow() {
        var opacity = 1 - (document.documentElement.scrollTop / getHomeBottomScrollToY()) * 2;
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

    //
    // Scroll down homepage on tagline click.
    //

    function easeInOut(value, duration, elapsed) {
        if (elapsed >= duration) {
            return value;
        }
        elapsed /= duration / 2;
        if (elapsed < 1) {
            return value / 2 * elapsed * elapsed;
        }
        elapsed -= 1;
        return -value / 2 * (elapsed * (elapsed - 2) - 1);
    }

    function smoothScroll(toY, duration) {
        var fromY = document.documentElement.scrollTop;
        var deltaY = toY - fromY;
        var startTimestamp;

        requestAnimationFrame(function animateScroll(timestamp) {
            startTimestamp = startTimestamp || timestamp;
            var currentY = fromY + easeInOut(deltaY, duration, timestamp - startTimestamp);
            window.scroll(0, currentY);
            if (currentY < toY) {
                requestAnimationFrame(animateScroll);
            }
        });
    }

    document.querySelector('.home__tagline').addEventListener('click', function(event) {
        smoothScroll(getHomeBottomScrollToY(), 1000);
        // Prevent adding the anchor to the URL; it's only a fallback for when JS is disabled.
        event.preventDefault();
    });
}());
