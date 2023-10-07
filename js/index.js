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

        // Calculate the distance to scroll
        // If the nav header is fixed, we need to subtract its height from the distance to scroll
        const positionToScroll = (targetElement != null ? window.scrollY + targetElement.getBoundingClientRect().top : 0) - (navHeaderElement.style.position === 'fixed' ? navHeaderElement.offsetHeight : 0);

        console.log(positionToScroll);

        // Scroll smoothly to the target element
        window.scrollTo({
            top: positionToScroll,
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