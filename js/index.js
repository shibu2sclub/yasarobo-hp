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

const slideshowElement = document.getElementById('key-visual-img-slideshow');
const generateSlideshow = new Promise((resolve, reject) => {
    fetch('/data/index-slideshow.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                const imgElement = document.createElement('img');
                imgElement.setAttribute('src', element.img);
                const captionElement = document.createElement('span');
                captionElement.innerHTML = element.caption;
                slideshowElement.appendChild(imgElement);
                slideshowElement.appendChild(captionElement);
            });
        })
        .then(() => {
            const slideshowImgElementsArray = Array.from(slideshowElement.getElementsByTagName('img'));
            const slideshowCaptionElementsArray = Array.from(slideshowElement.getElementsByTagName('span'));
            let currentImage = 0;
            function changeImg() {
                currentImage += 1
                if (currentImage >= slideshowImgElementsArray.length) {
                    currentImage = 0
                }
                lastImage = currentImage - 1 >= 0 ? currentImage - 1 : slideshowImgElementsArray.length - 1;
                nextImage = currentImage + 1 <= slideshowImgElementsArray.length - 1 ? currentImage + 1 : 0;
                slideshowImgElementsArray[lastImage].classList.remove('show');
                slideshowImgElementsArray[lastImage].classList.remove('after');
                slideshowImgElementsArray[currentImage].classList.add('show');  // 最初のスライド画像用
                setTimeout(() => {
                    slideshowImgElementsArray[nextImage].classList.add('show');
                    slideshowImgElementsArray[currentImage].classList.add('after');
                    slideshowCaptionElementsArray[currentImage].classList.add('show');
                    slideshowCaptionElementsArray[lastImage].classList.remove('show');
                }, 6000);
            }
            changeImg();    // 初回
            setInterval(() => {
                changeImg();
            }, 7000)
        })
        .then(() => {
            resolve();
        })
        .catch(error => console.error(error));
});