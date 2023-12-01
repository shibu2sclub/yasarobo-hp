function OnButtonClick() {
    // fetch record-setting.json
    const pointStringElement = document.getElementById('point-string');
    const robotIDElement = document.getElementById('robot-id');
    const pointBoxElement = document.getElementById('point-box');
    const debugMessageElement = document.getElementById('debug-message');

    let pageYear = checkYearParam();

    fetch(`/data/${pageYear}/record-setting.json`,{cache: "no-store"})
        .then(response => response.json())
        .then(data => {
            const result = calculateScore(data, robotIDElement.value, pointStringElement.value, true);
            pointBoxElement.innerText = result[0];
            debugMessageElement.innerHTML = "";
            result[3].forEach(message => {
                debugMessageElement.innerHTML += message + "<br>";
            });
        });
}