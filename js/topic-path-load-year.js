const judgeYearPastOrLatest = navBGOverlayUpdate.then(() => {
    return new Promise ((resolve, reject) => {
        fetch('/data/common.json')
            .then(response => response.json())
            .then(data => {
                const topicPathListLatestElement = document.querySelectorAll('.topic-path.latest-contest')[0];
                const topicPathListPastElement = document.querySelectorAll('.topic-path.past-contests')[0];
                const pageYearParam = getParam('y');
                // 過去大会
                if (pageYearParam != null && pageYearParam != siteYear) {
                    topicPathListPastElement.style.display = 'flex';
                    const linksAffectYear = topicPathListPastElement.getElementsByClassName("news-link-affect-year")[0];
                    linksAffectYear.setAttribute('href', `/news/?y=${pageYearParam}`);

                    const newsAddYearArray = Array.from(document.getElementsByClassName("news-add-year"));
                    newsAddYearArray.forEach(newsAddYear => {
                        newsAddYear.innerText += `（${pageYearParam}年度）`;
                    });

                    const newsAddYearEnArray = Array.from(document.getElementsByClassName("news-add-year-en"));
                    newsAddYearEnArray.forEach(newsAddYearEn => {
                        newsAddYearEn.innerText += ` (${pageYearParam})`;
                    });
                }
                // 最新大会
                else {
                    topicPathListLatestElement.style.display = 'flex';
                }
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});