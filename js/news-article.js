function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// First, let's fetch the news data from the JSON file
fetch('/data/news-label-setting.json')
    .then(response => response.json())
    .then(labelSettingData => {
        fetch('/data/news.json')
            .then(response => response.json())
            .then(data => {
                // Once we have the data, we can generate the DOM elements
                const newsArticleContainer = document.getElementById('news');
                
                const newsItem = data.filter(newsItem => newsItem.id == getParam('id'))[0];

                const newsArticleElement = document.createElement('div');
                newsArticleElement.classList.add('article');

                const newsTitleElement = generateNewsListItem(newsItem, labelSettingData);
                newsTitleElement.firstElementChild.removeAttribute('href'); // Remove link: タイトル用なのでリンク不要
                newsArticleElement.appendChild(newsTitleElement);

                newsItem.article.forEach(paragraph => {
                    const paragraphElement = document.createElement('p');
                    const budouxElement = document.createElement('budoux-ja');
                    budouxElement.innerHTML = paragraph;
                    paragraphElement.appendChild(budouxElement);
                    newsArticleElement.appendChild(paragraphElement);
                })
                

                newsArticleContainer.appendChild(newsArticleElement);
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));