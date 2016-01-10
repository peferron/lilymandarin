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
}());
