const judgeYearPastOrLatest = navBGOverlayUpdate.then(() => {
    return new Promise ((resolve, reject) => {
        const topicPathListLatestElement = document.querySelectorAll('.topic-path.latest-contest')[0];
        const topicPathListPastElement = document.querySelectorAll('.topic-path.past-contests')[0];
        let pageYear = checkYearParam();
        // 過去大会
        if (pageYear != siteYear) {
            topicPathListPastElement.style.display = 'flex';
            const newsLinksAffectYear = topicPathListPastElement.getElementsByClassName("news-link-affect-year")[0];
            if (newsLinksAffectYear != undefined) newsLinksAffectYear.setAttribute('href', `/news/?y=${pageYear}`);

            const recordLinksAffectYear = topicPathListPastElement.getElementsByClassName("record-link-affect-year")[0];
            if (recordLinksAffectYear != undefined) recordLinksAffectYear.setAttribute('href', `/record/?y=${pageYear}`);

            const addYearArray = Array.from(document.getElementsByClassName("add-year"));
            addYearArray.forEach(addYear => {
                addYear.innerText += `（${pageYear}年度）`;
            });

            const addYearEnArray = Array.from(document.getElementsByClassName("add-year-en"));
            addYearEnArray.forEach(addYearEn => {
                addYearEn.innerText += ` (${pageYear})`;
            });
        }
        // 最新大会
        else {
            topicPathListLatestElement.style.display = 'flex';
        }
        resolve();
    });
});