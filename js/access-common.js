const generateAccess = navBGOverlayUpdate.then((obj) => {
    return new Promise((resolve, reject) => {
        // fetch access.html and insert it into the DOM "#access-wrapper"
        const accessWrapperElement = document.getElementById('access-wrapper');
        fetch('/component/access.html')
            .then(response => response.text())
            .then(data => {
                accessWrapperElement.innerHTML = data;
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});