// First, let's fetch the news data from the JSON file
fetch('/data/news-tag-setting.json')
    .then(response => response.json())
    .then(settingData => {
        fetch('/data/news.json')
            .then(response => response.json())
            .then(data => {
                // Once we have the data, we can generate the DOM elements
                const newsListContainer = document.getElementById('news-list');

                const newsStart = Number(newsListContainer.getAttribute('start'));
                const newsEnd = Number(newsListContainer.getAttribute('end'));

                
                    data.splice(newsEnd + 1, data.length - (newsEnd + 1));
                    data.splice(0, newsStart);
                

                data.forEach(newsItem => {
                    const newsItemElement = document.createElement('div');
                    newsItemElement.classList.add('news-item');

                    const dateElement = document.createElement('div');
                    dateElement.classList.add('date');
                    dateElement.textContent = newsItem.date;
                    newsItemElement.appendChild(dateElement);

                    const labelContainerElement = document.createElement('div');
                    labelContainerElement.classList.add('tag');
                    newsItem.label.forEach(label => {
                        const labelElement = document.createElement('div');

                        const labelSetting = settingData.find(({ id }) => id === label);

                        labelElement.textContent = labelSetting.name;
                        labelElement.style.backgroundColor = labelSetting.color;
                        labelContainerElement.appendChild(labelElement);
                    });
                    newsItemElement.appendChild(labelContainerElement);

                    const titleElement = document.createElement('div');
                    titleElement.classList.add('title');
                    titleElement.textContent = newsItem.title;
                    newsItemElement.appendChild(titleElement);

                    newsListContainer.appendChild(newsItemElement);
                });
            })
            .catch(error => console.error(error));
        })
        .catch(error => console.error(error));