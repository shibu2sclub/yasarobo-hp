/* CSSのhas擬似要素が対応されるまでの間のプログラム。 */
/* 現時点で致命的に動作していないのはスマホのナビメニューだけなので、 */
/* 対象は実質Android Firefox使っている人だけ。やる気出ない。 */
/* 実行タイミングは"common.js"の"navBGOverlayUpdate"が終わった後。 */

// Judge the browser is firefox or not.
// Return: true or false

function isFirefox() {
    return navigator.userAgent.indexOf("Firefox") > 0;
}

const navMenuSupportFireFox = navBGOverlayUpdate.then((obj) => {
    return new Promise ((resolve, reject) => {
        if (isFirefox()) {
            // load common-firefox.css
            const linkElement = document.createElement('link');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('href', '/css/common-firefox.css');
            document.head.appendChild(linkElement);

            // nav-menu関連のクラス全てでチェックボックス変化で動作、チェックありでクラス追加
            const navHeadChkBoxElement = navHeadElement.getElementsByTagName('input')[0];
            const navMenuElement = document.getElementById('nav-menu');
            const navBGOverlayElement = document.getElementById('nav-bg-overlay');
            const navHeadElement = document.getElementById('nav-head');
            
            navHeadChkBoxElement.addEventListener('change', () => {
                if (navHeadChkBoxElement.checked) {
                    navMenuElement.classList.add('open');
                    navBGOverlayElement.classList.add('open');
                    navHeadElement.classList.add('open');
                }
                else {
                    navMenuElement.classList.remove('open');
                    navBGOverlayElement.classList.remove('open');
                    navHeadElement.classList.remove('open');
                }
            });

            resolve();
        }
    });
});