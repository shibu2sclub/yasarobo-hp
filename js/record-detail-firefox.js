const accordionSupportFireFoxRecordDOM = generateRecordDetail.then((obj) => {
    return new Promise ((resolve, reject) => {
        if (judgeBrowser() == "Firefox") {
            const accordionWrapperElementsArray = Array.from(document.getElementsByClassName('accordion-wrapper'));
            accordionWrapperElementsArray.forEach(element => {
                const accordionChkBoxElement = element.getElementsByTagName('input')[0];
                accordionChkBoxElement.addEventListener('change', () => {
                    if (accordionChkBoxElement.checked) {
                        element.classList.add('open-firefox');
                    }
                    else {
                        element.classList.remove('open-firefox');
                    }
                });
            });
        }
        resolve();
    });
});