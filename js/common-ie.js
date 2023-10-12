/* IEはグリッドやhasセレクタ、JSの一部演算子に対応しておらず、 */
/* もちろんこのWebサイトでも対応する予定はない。 */
/* そのため完全にリダイレクトをして非対応ページに遷移させる。 */
/* 実行タイミングは何も待たずすぐ。 */

// Judge the browser is IE or not.
// Return: true or false

function isIE() {
    return navigator.userAgent.indexOf("MSIE") > 0;
}

if (isIE()) {
    location.href = "/not-supported/";
}