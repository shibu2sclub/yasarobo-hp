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
