const generateNewsList = generateNavBGOverlay.then((obj) => {
    return new Promise ((resolve, reject) => {
        let pageYear = getParam('y');
        if (pageYear == null) {
            pageYear = siteYear;
        }
        // First, let's fetch the news data from the JSON file
        fetch('/data/news-label-setting.json')
            .then(response => response.json())
            .then(labelSettingData => {
                fetch(`/data/${pageYear}/news.json`)
                    .then(response => response.json())
                    .then(data => {
                        // Once we have the data, we can generate the DOM elements
                        const newsListContainer = document.getElementById('news-list');

                        const newsStart = Number(newsListContainer.getAttribute('start'));
                        const newsEnd = Number(newsListContainer.getAttribute('end'));

                        data.splice(newsEnd + 1, data.length - (newsEnd + 1));
                        data.splice(0, newsStart);

                        data.forEach(newsItem => {
                            newsListContainer.appendChild(generateNewsListItem(newsItem, labelSettingData, pageYear));
                        });
                    })
                    .catch(error => console.error(error));
                })
                .catch(error => console.error(error));
    });
});