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