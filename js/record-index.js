const generateRecordList = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();

        fetch(`/data/${pageYear}/record-setting.json`)
            .then(response => response.json())
            .then(recordSetting => {
                // 優先度の高い順に試技をソート
                const priorityOrderedScoreList = recordSetting.scoreList.sort((a, b) => a.priority - b.priority);
                const priorityOrderedScoreIDList = priorityOrderedScoreList.map(score => score.id);

                function generateRobotItem(robot) {
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
                    robotLinkElement.appendChild(robotNameElement);
                    robotLinkElement.innerHTML += "<br>";
                    contestPointElement = document.createElement('span');
                    contestPointElement.classList.add('contest-point');
                    contestPointElement.innerText = `競技点：${priorityResult.sumPoint}点`;
                    robotLinkElement.appendChild(contestPointElement);
                    if (priorityResult.judgePoint != undefined) {
                        const judgePointElement = document.createElement('span');
                        judgePointElement.classList.add('judge-point');
                        judgePointElement.innerText = `審査点：${priorityResult.judgePoint}点`;
                        robotLinkElement.appendChild(judgePointElement);
                    }
                    // 審査点がない場合のみ表示する（表示場所の都合）
                    else if (priorityResult.contestTime != undefined) {
                        const remainTimeElement = document.createElement('span');
                        remainTimeElement.classList.add('remain-time');
                        remainTimeElement.innerText = `競技時間：${timeConvertStringToJPString(priorityResult.contestTime)}`;
                        robotLinkElement.appendChild(remainTimeElement);
                    }
                    robotElement.appendChild(robotLinkElement);
                    return robotElement;
                }

                let recordListWithPoint = [];   // 全コースのリスト

                fetch(`/data/${pageYear}/record.json`)
                    .then(response => response.json())
                    .then(recordJSON => {
                        const recordListElement = document.getElementById('record-list');

                        const priorityRuleDescElement = document.createElement('p');
                        priorityRuleDescElement.innerText = `競技点は最終順位の決定に用いた「${priorityOrderedScoreList[0].name}」の結果を表示しています。`;
                        recordListElement.appendChild(priorityRuleDescElement);

                        recordSetting.courseList.forEach(courseRule => {
                            const courseID = courseRule.id;
                            const courseRobotList = generateRobotListWithPoint(recordSetting, recordJSON, courseID);
                            recordListWithPoint = recordListWithPoint.concat(courseRobotList);    // 全コースのリストを作成
                            const sortedCourseRobotList = sortRobotList(courseRobotList, priorityOrderedScoreIDList[0]);    // issue: 1条件のみでソートしている

                            const courseElement = document.createElement('div');
                            courseElement.classList.add('course');
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

                                const robotListElement = document.createElement('div');
                                robotListElement.classList.add('robot-list');

                                courseRobotListElement.appendChild(awardTitleElement);
                                robotListElement.appendChild(generateRobotItem(sortedCourseRobotList[i]));
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

                        fetch(`/data/${pageYear}/record-award.json`)
                            .then(response => response.json())
                            .then(recordAwardJSON => {
                                recordAwardJSON.award.forEach(award => {
                                    const awardElement = document.createElement('div');
                                    awardElement.classList.add('course');
                                    const awardTitleElement = document.createElement('h2');
                                    awardTitleElement.classList.add('course-title');
                                    awardTitleElement.innerText = award.name;
                                    awardElement.appendChild(awardTitleElement);
                                    const awardRobotListElement = document.createElement('div');
                                    awardRobotListElement.classList.add('course-robot-list-container');

                                    // filter recordListWithPoint by award.id == recordListWithPoint each element's id
                                    const awardRobotList = recordListWithPoint.filter(robot => robot.id == award.id);

                                    const robotListElement = document.createElement('div');
                                    
                                    robotListElement.classList.add('robot-list');
                                    awardRobotList.forEach(robot => {
                                        robotListElement.appendChild(generateRobotItem(robot));
                                    });
                                    awardRobotListElement.appendChild(robotListElement);
                                    awardElement.appendChild(awardRobotListElement);

                                    if (award.desc != undefined) {
                                        const awardDescH3Element = document.createElement('h3');
                                        awardDescH3Element.innerText = "授賞理由";
                                        awardElement.appendChild(awardDescH3Element);
                                        const awardDescBudouxElement = document.createElement('budoux-ja');
                                        const awardDescElement = document.createElement('p');
                                        awardDescElement.innerText = award.desc;
                                        awardDescBudouxElement.appendChild(awardDescElement);
                                        awardElement.appendChild(awardDescBudouxElement);
                                    }

                                    recordListElement.appendChild(awardElement);
                                });
                            })
                            .catch(error => console.error(error));
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });
});