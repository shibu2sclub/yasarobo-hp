/* common.jsのPromiseから引き続き */
const setNavHeaderBGColorSwitcher = navBGOverlayUpdate.then(() => {
    return new Promise((resolve, reject) => {
        function navHeaderBGColorSwitch() {
            if (keyVisualElement.getBoundingClientRect().bottom < 100) {
                document.getElementById('nav-head').classList.add('scrolled');
            }
            else {
                document.getElementById('nav-head').classList.remove('scrolled');
            }
        }

        const keyVisualElement = document.getElementById('key-visual');
        window.addEventListener('load', navHeaderBGColorSwitch);
        window.addEventListener('scroll', navHeaderBGColorSwitch);
        resolve();
    });
});

const slideshowElement = document.getElementById('key-visual-img-slideshow');
const generateSlideshow = setNavHeaderBGColorSwitcher.then(() => {
    return new Promise((resolve, reject) => {
        fetch('/data/index-slideshow.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(element => {
                    const imgElement = document.createElement('img');
                    imgElement.setAttribute('src', element.img);
                    const captionElement = document.createElement('span');
                    if (element.caption != undefined) captionElement.innerHTML = element.caption;
                    slideshowElement.appendChild(imgElement);
                    slideshowElement.appendChild(captionElement);
                });
            })
            .then(() => {
                const slideshowImgElementsArray = Array.from(slideshowElement.getElementsByTagName('img'));
                const slideshowCaptionElementsArray = Array.from(slideshowElement.getElementsByTagName('span'));
                let currentImage = -1;

                function changeImg() {
                    currentImage += 1
                    if (currentImage >= slideshowImgElementsArray.length) {
                        currentImage = 0
                    }
                    lastImage = currentImage - 1 >= 0 ? currentImage - 1 : slideshowImgElementsArray.length - 1;
                    nextImage = currentImage + 1 <= slideshowImgElementsArray.length - 1 ? currentImage + 1 : 0;
                    slideshowImgElementsArray[lastImage].classList.remove('show');
                    slideshowImgElementsArray[lastImage].classList.remove('after');
                    slideshowImgElementsArray[currentImage].classList.add('show');  // 初回の画像表示用
                    setTimeout(() => {
                        slideshowImgElementsArray[nextImage].classList.add('show');
                        slideshowImgElementsArray[currentImage].classList.add('after');
                        slideshowCaptionElementsArray[nextImage].classList.add('show');
                        slideshowCaptionElementsArray[currentImage].classList.remove('show');
                    }, 6000);
                }

                changeImg();
                setInterval(() => {
                    changeImg();
                }, 7000)
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

let youTubeUrl = '';

function videoPlayerSwitch() {
    const videoViewElement = document.getElementById('key-visual-player');
    if (videoViewElement.style.display == "none" || videoViewElement.classList.contains('disabled')) {
        if (videoViewElement.getAttribute('src') != '') videoViewElement.setAttribute('src', '');
    }
    else {
        if (videoViewElement.getAttribute('src') == '') videoViewElement.setAttribute('src', youTubeUrl);
    }
}

const generateVideoView = generateSlideshow.then(() => {
    return new Promise((resolve, reject) => {
        const videoViewElement = document.getElementById('key-visual-player');
        // fetch index-video.json and put the url into the videoViewElement
        fetch('/data/index-video.json')
            .then(response => response.json())
            .then(data => {
                youTubeUrl = 'https://www.youtube.com/embed/' + data.id + '?start=' + data.start + '&si=C_KkbHkAyLTeIPM_&controls=0&autoplay=1&mute=1&loop=1&playlist=' + data.id
                if (data["video-enabled"] == false) videoViewElement.classList.add('disabled');

                videoPlayerSwitch();
                // window.addEventListener('load', videoPlayerSwitch);
                window.addEventListener('resize', videoPlayerSwitch);
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const headerDataRewrite = generateVideoView.then(() => {
    return new Promise((resolve, reject) => {
        fetch(`/data/${siteYear}/information.json`)
            .then(response => response.json())
            .then(infoData => {
                const date = infoData.date.split('.');
                const dateObj = new Date(date[0], date[1] - 1, date[2]);
                const headerElement = document.getElementsByTagName('header')[0];

                const titleYear = headerElement.getElementsByClassName('title')[0].getElementsByClassName('upper')[0].getElementsByClassName('year')[0];
                titleYear.innerHTML = siteYear;

                const dateElement = headerElement.getElementsByClassName('date')[0];
                dateElement.getElementsByClassName('month')[0].innerHTML = dateObj.getMonth() + 1;
                dateElement.getElementsByClassName('day')[0].innerHTML = dateObj.getDate();
                dateElement.getElementsByClassName('weekday')[0].innerHTML = '日月火水木金土'[dateObj.getDay()];

                const detailElement = headerElement.getElementsByClassName('detail')[0];
                detailElement.getElementsByClassName('time')[0].innerHTML = infoData.time;
                detailElement.getElementsByClassName('place')[0].innerHTML = infoData.place.name;
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const generateDetail = headerDataRewrite.then(() => {
    return new Promise((resolve, reject) => {
        const detailElement = document.getElementById('detail');
        fetch(`/data/${siteYear}/information.json`)
            .then(response => response.json())
            .then(infoData => {
                const date = infoData.date.split('.');
                const dateObj = new Date(date[0], date[1] - 1, date[2]);

                detailElement.getElementsByClassName("time")[0].innerHTML = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日（${'日月火水木金土'[dateObj.getDay()]}）<br>${infoData.time}`;

                const timeDetailElement = detailElement.getElementsByClassName("time-detail")[0];
                if (infoData.timeDetail == undefined) {
                    timeDetailElement.style.display = "none";
                }
                else {
                    timeDetailElement.innerHTML = `<budoux-ja>${infoData.timeDetail}</budoux-ja>`;
                }

                detailElement.getElementsByClassName("place")[0].innerHTML = `${infoData.place.name}<br>${infoData.place.name2}`;

                const organizerList = detailElement.getElementsByClassName("organizer-list")[0];
                infoData.organizer.forEach(element => {
                    const organizerItem = document.createElement('li');
                    const organizerLink = document.createElement('a');

                    if (element.link != undefined) {
                        organizerLink.innerText = element.name;
                        organizerLink.setAttribute('href', element.link);
                        organizerLink.classList.add('external-link');
                        organizerItem.appendChild(organizerLink);
                    }
                    else {
                        organizerItem.innerText = element.name;
                    }
                    organizerList.appendChild(organizerItem);
                });

                const inquiryElement = detailElement.getElementsByClassName("inquiry")[0];
                inquiryElement.innerHTML = `${infoData.inquiry.name}<br><a href = "${infoData.inquiry.link}" class="external-link">${infoData.inquiry.linkName}</a>`;
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});

const generateAccess = generateDetail.then(() => {
    return new Promise((resolve, reject) => {
        // fetch access.html and insert it into the DOM "#access-wrapper"
        const accessWrapperElement = document.getElementById('access-wrapper');
        fetch(`/data/${siteYear}/information.json`)
            .then(response => response.json())
            .then(infoData => {
                fetch('/component/access.html')
                .then(response => response.text())
                .then(accessHTML => {
                    accessWrapperElement.innerHTML = accessHTML;

                    const textContainer = accessWrapperElement.getElementsByClassName('text-container')[0];
                    textContainer.innerHTML = '';

                    const placeName = document.createElement('div');
                    placeName.classList.add('place');
                    placeName.innerHTML = `${infoData.place.name}<br>${infoData.place.name2}`;
                    textContainer.appendChild(placeName);

                    const placeAddress = document.createElement('p');
                    placeAddress.classList.add('address');
                    placeAddress.innerHTML = `〒${infoData.place.postCode}<br>${infoData.place.address}`;
                    textContainer.appendChild(placeAddress);

                    infoData.place.transportation.forEach(element => {
                        const transportation = document.createElement('p');
                        transportation.classList.add('station');

                        const place = document.createElement('span');
                        place.innerText = element.place;
                        transportation.appendChild(place);

                        element.detail.forEach(detail => {
                            transportation.innerHTML += `<br>${detail}`;
                        });
                        textContainer.appendChild(transportation);
                    });

                    const mapContainer = accessWrapperElement.getElementsByClassName('map-container')[0];
                    const mapFrame = mapContainer.getElementsByTagName('iframe')[0];
                    mapFrame.setAttribute('src', infoData.place.googleMap);
                })
                .then(() => {
                    resolve();
                })
            })
            .catch(error => console.error(error));
    });
});

const adjustScrollHeight = generateAccess.then(() => {
    return new Promise((resolve, reject) => {
        const navHeadElement = document.getElementById("nav-head");
        const navMenuElement = document.getElementById("nav-menu");
        if (location.hash != "") {
            // Accessのgenerateが終わらないうちにスクロールすると、Accessの高さ分だけずれるので、再度スクロール動作をJSで強制的に実行する。
            const targetElement = document.getElementById(location.hash.substring(1));
            const positionToScroll = (targetElement != null ? window.scrollY + targetElement.getBoundingClientRect().top : 0) - (getComputedStyle(navMenuElement).zIndex == 20000 ? navHeadElement.offsetHeight : 0);
            // Scroll smoothly to the target element
            window.scrollTo({
                top: positionToScroll >= 0 ? positionToScroll : 0,
                behavior: 'instant'
            });
            history.replaceState('','','/');
        }
        resolve();
    });
});

const showLoadingScreenLogo = generateLogo.then(() => {
    return new Promise((resolve, reject) => {
        const loadingScreenElement = document.getElementById('loading-screen');
        const loadingScreenLogoElement = loadingScreenElement.getElementsByClassName('logo')[0];
        loadingScreenLogoElement.classList.add('show');
        resolve();
    });
});

const removeLoadingScreen = adjustScrollHeight.then(() => {
    return new Promise((resolve, reject) => {
        const loadingScreenElement = document.getElementById('loading-screen');
        loadingScreenElement.classList.add('loaded');
        setTimeout(() => {
            loadingScreenElement.style.display = "none";
        }, 1000);
        resolve();
    });
});