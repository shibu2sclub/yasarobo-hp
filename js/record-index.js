const generateRecordList = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();
        fetch(`/data/${pageYear}/record-setting.json`)
            .then(response => response.json())
            .then(recordSetting => {
                fetch(`/data/${pageYear}/record.json`)
                .then(response => response.json())
                .then(recordJSON => {
                    // 優先度の高い順に試技をソート
                    const priorityOrderedScoreList = recordSetting.scoreList.sort((a, b) => a.priority - b.priority);
                    const priorityOrderedScoreIDList = priorityOrderedScoreList.map(score => score.id);
                    
                    const recordListElement = document.getElementById('record-list');

                    const priorityRuleDescElement = document.createElement('p');
                    priorityRuleDescElement.innerText = `競技点は最終順位の決定に用いた「${priorityOrderedScoreList[0].name}」の結果を表示しています。`;
                    recordListElement.appendChild(priorityRuleDescElement);

                    recordSetting.courseList.forEach(courseRule => {
                        const courseID = courseRule.id;

                        const courseRobotList = generateRobotListWithPoint(recordSetting, recordJSON, courseID);
                        const sortedCourseRobotList = sortRobotList(courseRobotList, priorityOrderedScoreIDList[0]);    // issue: 1条件のみでソートしている

                        const courseElement = document.createElement('div');
                        courseElement.classList.add('course');
                        // courseElement.id = courseID;
                        const courseTitleElement = document.createElement('h2');
                        courseTitleElement.classList.add('course-title');
                        courseTitleElement.innerText = courseRule.name;
                        courseElement.appendChild(courseTitleElement);
                        const courseRobotListElement = document.createElement('div');
                        courseRobotListElement.classList.add('course-robot-list-container');

                        for (let i = 0; (i < 2 && i < sortedCourseRobotList.length); i++) {
                            const awardTitleElement = document.createElement('h3');
                            if (i == 0) awardTitleElement.innerText = "最優秀賞";
                            else if (i == 1) awardTitleElement.innerText = "優秀賞";
                            courseRobotListElement.appendChild(awardTitleElement);
                            const robotListElement = document.createElement('div');
                            robotListElement.classList.add('robot-list');
                            
                            const robot = sortedCourseRobotList[i];
                            const robotElement = document.createElement('div');
                            robotElement.classList.add('robot');
                            const robotLinkElement = document.createElement('a');
                            robotLinkElement.classList.add('robot-link');
                            robotLinkElement.setAttribute('href', `/record/detail/?y=${pageYear}&r=${robot.id}`);
                            
                            // 優先度が最も高い競技のデータを表示
                            const priorityResult = robot.result[priorityOrderedScoreIDList[0]];
                            robotNameElement = document.createElement('span');
                            robotNameElement.classList.add('robot-name');
                            robotNameElement.innerText = robot.name;
                            contestPointElement = document.createElement('span');
                            contestPointElement.classList.add('contest-point');
                            contestPointElement.innerText = `競技点：${priorityResult.sumPoint}点`;
                            judgePointElement = document.createElement('span');
                            judgePointElement.classList.add('judge-point');
                            if (priorityResult.judgePoint != undefined) judgePointElement.innerText = `審査点：${priorityResult.judgePoint}`;
                            remainTimeElement = document.createElement('span');
                            remainTimeElement.classList.add('remain-time');
                            if (priorityResult.remainTime != undefined) remainTimeElement.innerText = `競技時間：${priorityResult.remainTime.split(':')[0]}分${priorityResult.remainTime.split(':')[1]}秒${priorityResult.remainTime.split(':')[2]}`;
                            robotLinkElement.appendChild(robotNameElement);
                            robotLinkElement.innerHTML += "<br>";
                            robotLinkElement.appendChild(contestPointElement);
                            robotLinkElement.appendChild(judgePointElement);
                            robotLinkElement.appendChild(remainTimeElement);

                            robotElement.appendChild(robotLinkElement);
                            robotListElement.appendChild(robotElement);
                            courseRobotListElement.appendChild(robotListElement);
                        }
                        const courseMoreElement = document.createElement('a');
                        courseMoreElement.classList.add('course-more');
                        courseMoreElement.classList.add('internal-link');
                        courseMoreElement.setAttribute('href', `/record/ranking/?y=${pageYear}&c=${courseID}`);
                        courseMoreElement.innerText = "もっと見る";
                        courseRobotListElement.appendChild(courseMoreElement);
                        courseElement.appendChild(courseRobotListElement);
                        recordListElement.appendChild(courseElement);
                    });
                })
                .then(() => {
                    resolve();
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });
});