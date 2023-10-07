const footerElement = document.getElementsByTagName('footer')[0];
// Generate the common footer in the "footerElement". The footer html is in /component/footer.html.
const generateFooter = new Promise ((resolve, reject) => {
    fetch('/component/footer.html')
        .then(response => response.text())
        .then(data => {
            footerElement.innerHTML = data;
        })
        .then(data => {
            resolve();
        })
        .catch(error => console.error(error));
});

const navHeadElement = document.getElementById('nav-head');
const generateNavHead = generateFooter.then((obj) => {
    return new Promise ((resolve, reject) => {
        fetch('/component/nav-head.html')
            .then(response => response.text())
            .then(data => {
                navHeadElement.innerHTML = data;
            })
            .then(data => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const navMenuElement = document.getElementById('nav-menu');
const generateNavMenu = generateNavHead.then((obj) => {
    return new Promise ((resolve, reject) => {
        fetch('/component/nav-menu.html')
            .then(response => response.text())
            .then(data => {
                navMenuElement.innerHTML = data;
            })
            .then(data => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const generateLogo = generateNavMenu.then((obj) => {
    return new Promise ((resolve, reject) => {
        fetch('/component/logo.html')
            .then(response => response.text())
            .then(data => {
                const logoElements = document.getElementsByClassName('logo');
                Array.from(logoElements).forEach(logoElement => {
                    logoElement.innerHTML = data;
                })
            })
            .then(data => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const navMenuLinkUpdate = generateLogo.then((obj) => {
    return new Promise ((resolve, reject) => {
        // Select all links with hashes
        const links = document.querySelectorAll('a[href^="/#"]');
        const topLinks = document.querySelectorAll('a[href="/#top"]');

        // Check if the current path is root（rootでのみリンクのページ内スクロール遷移が存在）
        if (location.pathname == '/') {
            // Loop through each link and add a click event listener
            links.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Prevent default behavior
                    e.preventDefault();

                    // Get the target element's ID
                    const targetId = this.getAttribute('href').slice(2);
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
        }
        else {
            topLinks.forEach(link => {
                link.setAttribute('href', '/');
            });
        }
        resolve();
    });
});