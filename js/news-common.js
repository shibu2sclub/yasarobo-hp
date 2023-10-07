function generateNewsListItem(newsItem, labelSettingData) {
    const newsItemElement = document.createElement('div');
    newsItemElement.classList.add('news-item');
    
    const newsItemAnchorElement = document.createElement('a');
    if (newsItem.article != undefined) {
        newsItemAnchorElement.href = "/news/article/?id=" + String(newsItem.id);
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