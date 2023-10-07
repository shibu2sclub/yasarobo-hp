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