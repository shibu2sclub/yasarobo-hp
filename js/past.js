const generatePastContestList = generateNavBGOverlay.then(() => {
    return new Promise ((resolve, reject) => {
        // fetch common.json
        fetch('/data/common.json')
            .then(response => response.json())
            .then(data => {
                let pastYearsList = data.pastYears;
                // sort pastYearsList
                pastYearsList.sort((a, b) => {
                    return b - a;
                });
                pastYearsList.forEach((year) => {
                    fetch(`/data/${year}/information.json`)
                        .then(response => response.json())
                        .then(yearInfo => {
                            const contentElement = document.getElementById('content');
                            const articleElement = contentElement.getElementsByClassName('article')[0];

                            const pastContestElement = document.createElement('div');
                            
                            const h2YearElement = document.createElement('h2');
                            h2YearElement.innerText = `${year}年度大会`;
                            pastContestElement.appendChild(h2YearElement);
                            
                            const h3DateElement = document.createElement('h3');
                            h3DateElement.innerText = '開催日時';
                            pastContestElement.appendChild(h3DateElement);
                            
                            const pDateElement = document.createElement('p');
                            const date = yearInfo.date.split('.');
                            const dateObj = new Date(date[0], date[1] - 1, date[2]);
                            pDateElement.innerHTML = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日（${'日月火水木金土'[dateObj.getDay()]}）<br>${yearInfo.time}`;
                            pastContestElement.appendChild(pDateElement);

                            const h3PlaceElement = document.createElement('h3');
                            h3PlaceElement.innerText = '開催場所';
                            pastContestElement.appendChild(h3PlaceElement);

                            const pPlaceElement = document.createElement('p');
                            pPlaceElement.innerHTML = `${yearInfo.place.name}<br>${yearInfo.place.name2}`;
                            pastContestElement.appendChild(pPlaceElement);
                            
                            const pAddressElement = document.createElement('p');
                            pAddressElement.innerHTML = `〒${yearInfo.place.postCode}<br>${yearInfo.place.address}`;
                            pastContestElement.appendChild(pAddressElement);

                            const linkListElement = document.createElement('ul');
                            linkListElement.classList.add('links-list');

                            const linkNewsElement = document.createElement('li');
                            const linkNewsAElement = document.createElement('a');
                            linkNewsAElement.innerText = 'お知らせ';
                            linkNewsAElement.href = `/news/?y=${year}`;
                            linkNewsAElement.classList.add('internal-link');
                            linkNewsElement.appendChild(linkNewsAElement);
                            linkListElement.appendChild(linkNewsElement);
                            
                            const linkRecordElement = document.createElement('li');
                            const linkRecordAElement = document.createElement('a');
                            linkRecordAElement.innerText = '競技記録';
                            linkRecordAElement.href = `/record/?y=${year}`;
                            linkRecordAElement.classList.add('internal-link');
                            linkRecordElement.appendChild(linkRecordAElement);
                            linkListElement.appendChild(linkRecordElement);
                            
                            if (yearInfo.rule != undefined) {
                                const linkRuleElement = document.createElement('li');
                                const linkRuleAElement = document.createElement('a');
                                linkRuleAElement.innerText = yearInfo.rule.name;
                                linkRuleAElement.href = yearInfo.rule.link;
                                linkRuleAElement.classList.add('external-link');
                                linkRuleAElement.setAttribute('target', '_blank');
                                linkRuleElement.appendChild(linkRuleAElement);
                                linkListElement.appendChild(linkRuleElement);
                            }
                            
                            pastContestElement.appendChild(linkListElement);
                            articleElement.appendChild(pastContestElement);
                        })
                        .then(() => {
                            resolve();
                        })
                });
            })
            .catch(error => console.error(error));
    });
});