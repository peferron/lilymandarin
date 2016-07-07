(function() {
    //
    // Avoid sudden background resize on mobile browsers when the address bar is hidden.
    //

    var homeTop = document.querySelector('.home__top');
    var windowHeightIndicator = document.querySelector('.home__top-height-indicator');
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
}());
