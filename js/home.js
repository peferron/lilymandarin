(function() {
    //
    // Avoid sudden background resize on mobile browsers when the address bar is hidden.
    //

    var homeTop = document.querySelector('.home__top');
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
