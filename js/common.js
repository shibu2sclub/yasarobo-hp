// Judge the browser.
// Return: The browser name.

function judgeBrowser() {
    var ua = navigator.userAgent;
    if (ua.indexOf("MSIE") > 0 || ua.indexOf("Trident") > 0) {
        return "IE";
    } else if (ua.indexOf("Firefox") > 0) {
        return "Firefox";
    } else if (ua.indexOf("Chrome") > 0) {
        return "Chrome";
    } else if (ua.indexOf("Chromium") > 0) {
        return "Chromium";
    } else if (ua.indexOf("Safari") > 0) {
        return "Safari";
    } else if (ua.indexOf("Opera") > 0) {
        return "Opera";
    } else if (ua.indexOf("OPR") > 0) {
        return "Blink Opera";
    } else {
        return "Unknown";
    }
}

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function checkYearParam() {
    let pageYear = getParam('y');
    if (pageYear == null) {
        pageYear = siteYear;
    }
    return pageYear;
}

const allWrapperElement = document.getElementById('all-wrapper');
const containerElement = document.getElementById('container');

const footerElement = document.createElement('footer');

let siteYear = '';

const loadSiteYear = new Promise ((resolve, reject) => {
    fetch('/data/common.json')
        .then(response => response.json())
        .then(data => {
            siteYear = data.year;
        })
        .then(() => {
            resolve();
        })
        .catch(error => console.error(error));
});

// Generate the common footer in the "footerElement". The footer html is in /component/footer.html.
const generateFooter = loadSiteYear.then((obj) => {
    return new Promise ((resolve, reject) => {
        fetch('/component/footer.html')
            .then(response => response.text())
            .then(data => {
                footerElement.innerHTML = data;
                containerElement.appendChild(footerElement);
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const navHeadElement = document.createElement('nav');
const generateNavHead = generateFooter.then((obj) => {
    return new Promise ((resolve, reject) => {
        navHeadElement.setAttribute('id', 'nav-head');
        fetch('/component/nav-head.html')
            .then(response => response.text())
            .then(data => {
                navHeadElement.innerHTML = data;
                allWrapperElement.insertBefore(navHeadElement, containerElement);
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const navMenuElement = document.createElement('nav');
const generateNavMenu = generateNavHead.then((obj) => {
    return new Promise ((resolve, reject) => {
        navMenuElement.setAttribute('id', 'nav-menu');
        fetch('/component/nav-menu.html')
            .then(response => response.text())
            .then(data => {
                navMenuElement.innerHTML = data;
                allWrapperElement.insertBefore(navMenuElement, containerElement);
                // fetch common.json
                fetch('/data/common.json')
                    .then(response => response.json())
                    .then(data => {
                        const recordBtnElement = document.getElementById('record');
                        if (!data.showRecord) {
                            recordBtnElement.style.display = 'none';
                        }
                        const pastBtnElement = document.getElementById('past');
                        if (data.pastYears == undefined || data.pastYears.length == 0) {
                            pastBtnElement.style.display = 'none';
                        }
                    })
                    .catch(error => console.error(error));
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const navBGOverlayElement = document.createElement('div');
const generateNavBGOverlay = generateNavMenu.then((obj) => {
    return new Promise ((resolve, reject) => {
        navBGOverlayElement.setAttribute('id', 'nav-bg-overlay');
        allWrapperElement.insertBefore(navBGOverlayElement, containerElement);
        resolve();
    });
});

const generateLogo = generateNavBGOverlay.then((obj) => {
    return new Promise ((resolve, reject) => {
        fetch('/component/logo.html')
            .then(response => response.text())
            .then(data => {
                const logoElements = document.getElementsByClassName('logo');
                Array.from(logoElements).forEach(logoElement => {
                    logoElement.innerHTML = data;
                    logoElement.getElementsByClassName("year")[0].innerText = siteYear;
                })
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const navMenuLinkUpdate = generateLogo.then((obj) => {
    return new Promise ((resolve, reject) => {
        const navHeadChkBoxElement = navHeadElement.getElementsByTagName('input')[0];
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
                    // console.log(getComputedStyle(navMenuElement).zIndex);
                    const positionToScroll = (targetElement != null ? window.scrollY + targetElement.getBoundingClientRect().top : 0) - (getComputedStyle(navMenuElement).zIndex == 20000 ? navHeaderElement.offsetHeight : 0);

                    navHeadChkBoxElement.checked = false;

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

const navBGOverlayUpdate = navMenuLinkUpdate.then((obj) => {
    return new Promise ((resolve, reject) => {
        const navHeadChkBoxElement = navHeadElement.getElementsByTagName('input')[0];
        navBGOverlayElement.addEventListener('click', function(e) {
            navHeadChkBoxElement.checked = false;
        });
        resolve();
    });
});

const judgeYearPastOrLatest = navBGOverlayUpdate.then(() => {
    return new Promise ((resolve, reject) => {
        const topicPathListLatestElement = document.querySelectorAll('.topic-path.latest-contest')[0];
        const topicPathListPastElement = document.querySelectorAll('.topic-path.past-contests')[0];

        if (topicPathListLatestElement != undefined && topicPathListPastElement != undefined) {
            let pageYear = checkYearParam();
            // 過去大会
            if (pageYear != siteYear) {
                topicPathListPastElement.style.display = 'flex';
                const newsLinksAffectYear = topicPathListPastElement.getElementsByClassName("news-link-affect-year")[0];
                if (newsLinksAffectYear != undefined) newsLinksAffectYear.setAttribute('href', `/news/?y=${pageYear}`);

                const recordLinksAffectYear = topicPathListPastElement.getElementsByClassName("record-link-affect-year")[0];
                if (recordLinksAffectYear != undefined) recordLinksAffectYear.setAttribute('href', `/record/?y=${pageYear}`);

                const addYearArray = Array.from(document.getElementsByClassName("add-year"));
                addYearArray.forEach(addYear => {
                    addYear.innerText += `（${pageYear}年度）`;
                });

                const addYearEnArray = Array.from(document.getElementsByClassName("add-year-en"));
                addYearEnArray.forEach(addYearEn => {
                    addYearEn.innerText += ` (${pageYear})`;
                });
            }
            // 最新大会
            else {
                topicPathListLatestElement.style.display = 'flex';
            }
        }
        resolve();
    });
});