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