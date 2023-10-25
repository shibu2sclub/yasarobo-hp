function generateNewsListItem(newsItem, labelSettingData, year = siteYear) {
    if (year == null) year = siteYear;

    const newsItemElement = document.createElement('div');
    newsItemElement.classList.add('news-item');
    
    const newsItemAnchorElement = document.createElement('a');
    if (newsItem.article != undefined) {
        newsItemAnchorElement.href = `/news/article/?y=${year}&id=${newsItem.id}`;
        newsItemElement.appendChild(newsItemAnchorElement);
    }

    const newsItemTxtContainerElement = newsItem.article != undefined ? newsItemAnchorElement : newsItemElement;

    const dateElement = document.createElement('div');
    dateElement.classList.add('date');
    dateElement.textContent = newsItem.date;
    newsItemTxtContainerElement.appendChild(dateElement);

    const labelContainerElement = document.createElement('div');
    labelContainerElement.classList.add('tag');
    newsItem.label.forEach(label => {
        const labelElement = document.createElement('div');

        const labelSetting = labelSettingData.find(({ id }) => id === label);

        labelElement.textContent = labelSetting.name;
        labelElement.style.backgroundColor = labelSetting.color;
        labelContainerElement.appendChild(labelElement);
    });
    newsItemTxtContainerElement.appendChild(labelContainerElement);

    const titleElement = document.createElement('div');
    titleElement.classList.add('title');
    titleElement.textContent = newsItem.title;
    newsItemTxtContainerElement.appendChild(titleElement);

    return newsItemElement;
}

const newsUrlCheckAddYear = loadSiteYear.then(() => {
    return new Promise((resolve, reject) => {
        const paramY = getParam("y");

        // 最新年以外は過去年のリストと比較して正しい年かを確認、だめなら404へ
        if (paramY != null && paramY != siteYear) {
            // fetch common.json and compare paramY with pastYears list in common.json
            // if paramY is not in pastYears list, redirect to error page
            fetch("/data/common.json")
                .then(response => response.json())
                .then(commonJSON => {
                    const pastYears = commonJSON.pastYears;
                    if (pastYears.indexOf(Number(paramY)) == -1) {
                        location.href = "/404/";
                    }
                })
                .catch(error => console.error(error));
        }
    });
});