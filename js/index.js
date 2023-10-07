// Select all links with hashes
const links = document.querySelectorAll('a[href^="#"]');

// Loop through each link and add a click event listener
links.forEach(link => {
    link.addEventListener('click', function(e) {
        // Prevent default behavior
        e.preventDefault();

        // Get the target element's ID
        const targetId = this.getAttribute('href').slice(1);
        // Get the target element
        const targetElement = document.getElementById(targetId);

        const navHeaderElement = document.getElementById('nav-head');
        const navMenuElement = document.getElementById('nav-menu');

        // Calculate the distance to scroll
        // If the nav header is fixed, we need to subtract its height from the distance to scroll
        console.log(getComputedStyle(navMenuElement).zIndex);
        const positionToScroll = (targetElement != null ? window.scrollY + targetElement.getBoundingClientRect().top : 0) - (getComputedStyle(navMenuElement).zIndex == 20000 ? navHeaderElement.offsetHeight : 0);

        // Scroll smoothly to the target element
        window.scrollTo({
            top: positionToScroll >= 0 ? positionToScroll : 0,
            behavior: 'smooth'
        });
    });
});

const keyVisualVideoElement = document.getElementById('key-visual-player');
window.addEventListener('load', videoPlayerSwitch);
window.addEventListener('resize', videoPlayerSwitch);

function videoPlayerSwitch() {
    if (keyVisualVideoElement.style.display == "none") {
        keyVisualVideoElement.setAttribute('src', '');
    }
    else {
        keyVisualVideoElement.setAttribute('src', 'https://www.youtube.com/embed/cW514x4bg20?start=93&si=C_KkbHkAyLTeIPM_&controls=0&autoplay=1&mute=1&loop=1&playlist=cW514x4bg20');
    }
}

const keyVisualElement = document.getElementById('key-visual');
window.addEventListener('load', navHeaderBGColorSwitch);
window.addEventListener('scroll', navHeaderBGColorSwitch);

function navHeaderBGColorSwitch() {
    if (keyVisualElement.getBoundingClientRect().bottom < 100) {
        document.getElementById('nav-head').classList.add('scrolled');
    }
    else {
        document.getElementById('nav-head').classList.remove('scrolled');
    }
}