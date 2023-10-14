/* CSSのhas擬似要素が対応されるまでの間のプログラム。 */
/* 現時点で致命的に動作していないのはスマホのナビメニューだけなので、 */
/* 対象は実質Android Firefox使っている人だけ。やる気出ない。 */
/* 実行タイミングは"common.js"の"navBGOverlayUpdate"が終わった後。 */

// Judge the browser is firefox or not.
// Return: true or false

const navMenuSupportFireFox = navBGOverlayUpdate.then((obj) => {
    return new Promise ((resolve, reject) => {
        if (judgeBrowser() == "Firefox") {
            console.log("Firefox detected.")
            // nav-menu関連のクラス全てでチェックボックス変化で動作、チェックありでクラス追加
            const navHeadChkBoxElement = navHeadElement.getElementsByTagName('input')[0];

            navHeadChkBoxElement.addEventListener('change', () => {
                if (navHeadChkBoxElement.checked) {
                    navMenuElement.classList.add('open-firefox');
                    navBGOverlayElement.classList.add('open-firefox');
                    navHeadElement.classList.add('open-firefox');
                }
                else {
                    navMenuElement.classList.remove('open-firefox');
                    navBGOverlayElement.classList.remove('open-firefox');
                    navHeadElement.classList.remove('open-firefox');
                }
            });

            navBGOverlayElement.addEventListener('click', () => {
                navHeadChkBoxElement.checked = false;
                navMenuElement.classList.remove('open-firefox');
                navBGOverlayElement.classList.remove('open-firefox');
                navHeadElement.classList.remove('open-firefox');
            });

            const links = document.querySelectorAll('a[href^="/#"]');
            if (location.pathname == '/') {
                Array.from(links).forEach(element => {
                    element.addEventListener('click', () => {
                        navHeadChkBoxElement.checked = false;
                        console.log("test")
                        navMenuElement.classList.remove('open-firefox');
                        navBGOverlayElement.classList.remove('open-firefox');
                        navHeadElement.classList.remove('open-firefox');
                    });
                });
            }

            resolve();
        }
    });
});