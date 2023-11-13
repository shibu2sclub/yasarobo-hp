const generateRecordList = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();

        fetch(`/data/${pageYear}/record-setting.json`)
            .then(response => response.json())
            .then(recordSetting => {
                if (!recordSetting.showAward) {
                    // 最初のコースのランキング（競技順序に自動遷移）
                    location.href = `/record/ranking/?y=${pageYear}&c=${recordSetting.courseList[0].id}`;
                }
                const priorityScoreSetting = recordSetting.scoreList.filter(score => score.priority == 1)[0];   // もっとも優先度の高いスコアの設定情報
                function generateRobotItem(robot) {
                    const robotElement = document.createElement('div');
                    robotElement.classList.add('robot');
                    const robotLinkElement = document.createElement('a');
                    robotLinkElement.classList.add('robot-link');
                    robotLinkElement.setAttribute('href', `/record/detail/?y=${pageYear}&r=${robot.id}`);
                    
                    // 優先度が最も高い競技のデータを表示
                    const priorityResult = robot.result[priorityScoreSetting.id];
                    const robotIDElement = document.createElement('div');
                    robotIDElement.classList.add('robot-id');
                    robotIDElement.innerText = robot.id;
                    robotLinkElement.appendChild(robotIDElement);
                    const robotNameElement = document.createElement('div');
                    robotNameElement.classList.add('robot-name');
                    robotNameElement.innerText = robot.name;
                    robotLinkElement.appendChild(robotNameElement);
                    const robotTeamNameElement = document.createElement('div');
                    robotTeamNameElement.classList.add('robot-team-name');
                    robotTeamNameElement.innerText = robot.team;
                    robotLinkElement.appendChild(robotTeamNameElement);
                    if (robot.belonging != undefined && robot.belonging != "") {
                        const robotBelongingNameElement = document.createElement('div');
                        robotBelongingNameElement.classList.add('robot-belonging-name');
                        robotBelongingNameElement.innerText = robot.belonging;
                        robotLinkElement.appendChild(robotBelongingNameElement);
                    }
                    const robotSumPointElement = document.createElement('div');
                    if (priorityResult != undefined && priorityResult.sumPoint != undefined) robotSumPointElement.innerText = `得点：${priorityResult.sumPoint}点`; // 試技が行われているとき・得点が算出されているときのみ表示（エラー防止）
                    else if (priorityResult != undefined) robotSumPointElement.innerText = priorityResult.remark || "";
                    else robotSumPointElement.innerText = "競技結果なし";   // issue: 他の競技結果がある場合は表示できるようにしたい
                    robotLinkElement.appendChild(robotSumPointElement);
                    const robotDetailRecordElement = document.createElement('div');
                    if (priorityResult != undefined && priorityResult.judgePoint != undefined) {
                        const contestPointElement = document.createElement('span');
                        contestPointElement.classList.add('contest-point');
                        contestPointElement.innerText = `競技点：${priorityResult.contestPoint}点`;
                        robotDetailRecordElement.appendChild(contestPointElement);
                        const judgePointElement = document.createElement('span');
                        judgePointElement.classList.add('judge-point');
                        judgePointElement.innerText = `審査点：${priorityResult.judgePoint}点`;
                        robotDetailRecordElement.appendChild(judgePointElement);
                    }
                    // 審査点がない場合のみ表示する（表示場所の都合）
                    else if (priorityResult != undefined && priorityResult.contestTime != undefined) {
                        const remainTimeElement = document.createElement('span');
                        remainTimeElement.classList.add('remain-time');
                        remainTimeElement.innerText = `競技時間：${timeConvertStringToJPString(priorityResult.contestTime)}`;
                        robotDetailRecordElement.appendChild(remainTimeElement);
                    }
                    robotLinkElement.appendChild(robotDetailRecordElement);
                    robotElement.appendChild(robotLinkElement);
                    return robotElement;
                }

                let recordListWithPoint = [];   // 全コースのリスト

                fetch(`/data/${pageYear}/record-award.json`)
                    .then(response => response.json())
                    .then(recordAwardJSON => {
                        if (recordSetting.showAward) {
                            fetch(`/data/${pageYear}/record.json`)
                                .then(response => response.json())
                                .then(recordJSON => {
                                    const recordListElement = document.getElementById('record-list');

                                    const priorityRuleDescElement = document.createElement('p');
                                    priorityRuleDescElement.innerText = `競技点は最終順位の決定に用いた「${priorityScoreSetting.name}」の結果を表示しています。`;
                                    recordListElement.appendChild(priorityRuleDescElement);

                                    recordSetting.courseList.forEach(courseRule => {
                                        const courseID = courseRule.id;
                                        const courseRobotList = generateRobotListWithPoint(recordSetting, recordJSON, courseID);
                                        recordListWithPoint = recordListWithPoint.concat(courseRobotList);    // 全コースのリストを作成
                                        const sortedCourseRobotList = sortRobotList(recordSetting, courseRobotList).filter(robot => robot.result[priorityScoreSetting.id] != undefined && robot.result[priorityScoreSetting.id].sumPoint != undefined);

                                        const courseElement = document.createElement('div');
                                        courseElement.classList.add('course');
                                        const courseTitleElement = document.createElement('h2');
                                        courseTitleElement.classList.add('course-title');
                                        courseTitleElement.innerText = courseRule.name;
                                        courseElement.appendChild(courseTitleElement);
                                        const courseRobotListElement = document.createElement('div');
                                        courseRobotListElement.classList.add('course-robot-list-container');
                                        const robotListElement = document.createElement('div');
                                        robotListElement.classList.add('robot-list');

                                        const sortedCourseRobotListForAward = sortedCourseRobotList.filter(robot => robot.result[priorityScoreSetting.id] != undefined && robot.result[priorityScoreSetting.id].sumPoint != undefined && robot.result[priorityScoreSetting.id].sumPoint != 0); // 試技が行われていない場合や得点が0点の場合は表示しない
                                        for (let i = 0; (i < 2 && i < sortedCourseRobotListForAward.length); i++) {
                                            const robotContainerElement = document.createElement('div');
                                            robotContainerElement.classList.add('robot-container');
                                            const awardTitleElement = document.createElement('h3');
                                            if (i == 0) awardTitleElement.innerText = "優勝";
                                            else if (i == 1) awardTitleElement.innerText = "準優勝";

                                            robotContainerElement.appendChild(awardTitleElement);
                                            robotContainerElement.appendChild(generateRobotItem(sortedCourseRobotListForAward[i]));
                                            robotListElement.appendChild(robotContainerElement);
                                        }
                                        courseRobotListElement.appendChild(robotListElement);
                                        if (sortedCourseRobotListForAward.length == 1) {
                                            const awardRemarkElement = document.createElement('p');
                                            if (sortedCourseRobotList[1] == undefined || sortedCourseRobotList[1].result[priorityScoreSetting.id] == undefined) awardRemarkElement.innerText = "該当者がいないため、表彰としての準優勝はありませんでした。"; // 試技さえ行われていなかった場合
                                            else awardRemarkElement.innerText = "成績上の該当者がいないため、表彰としての準優勝はありませんでした。";   // 試技は行われていた場合
                                            courseRobotListElement.appendChild(awardRemarkElement);
                                        }
                                        else if (sortedCourseRobotListForAward.length == 0) {
                                            const awardRemarkElement = document.createElement('p');
                                            awardRemarkElement.innerText = "出場者がいないため、表彰はありませんでした。";
                                            courseRobotListElement.appendChild(awardRemarkElement);
                                        }
                                        if (sortedCourseRobotListForAward.length > 0) {
                                            const courseMoreElement = document.createElement('a');
                                            courseMoreElement.classList.add('course-more');
                                            courseMoreElement.classList.add('internal-link');
                                            courseMoreElement.setAttribute('href', `/record/ranking/?y=${pageYear}&c=${courseID}`);
                                            courseMoreElement.innerText = "もっと見る";
                                            courseRobotListElement.appendChild(courseMoreElement);
                                        }
                                        courseElement.appendChild(courseRobotListElement);
                                        recordListElement.appendChild(courseElement);
                                    });

                                    recordAwardJSON.award.forEach(award => {
                                        const awardElement = document.createElement('div');
                                        awardElement.classList.add('course');
                                        const awardTitleElement = document.createElement('h2');
                                        awardTitleElement.classList.add('course-title');
                                        awardTitleElement.innerText = award.name;
                                        awardElement.appendChild(awardTitleElement);
                                        const awardRobotListElement = document.createElement('div');
                                        awardRobotListElement.classList.add('course-robot-list-container');

                                        if (typeof(award.id) != "object") award.id = [award.id];
                                        // filter recordListWithPoint by award.id == recordListWithPoint each element's id
                                        let awardRobotList = [];
                                        award.id.forEach(id => {
                                            awardRobotList = awardRobotList.concat(recordListWithPoint.filter(robot => robot.id == id));
                                        });
                                        
                                        const robotListElement = document.createElement('div');
                                        robotListElement.classList.add('robot-list');

                                        awardRobotList.forEach(robot => {
                                            const robotContainerElement = document.createElement('div');
                                            robotContainerElement.classList.add('robot-container');
                                            robotContainerElement.appendChild(generateRobotItem(robot));
                                            robotListElement.appendChild(robotContainerElement);
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
                                .then(() => {
                                    resolve();
                                })
                                .catch(error => console.error(error));
                            }
                            else {
                                // 遷移失敗時表示用
                                const recordListElement = document.getElementById('record-list');
                                const recordListElementTitle = document.createElement('h2');
                                recordListElementTitle.innerText = "競技順序のみ公開中です。上のメニューバーからコースを選択してください。";
                                recordListElement.appendChild(recordListElementTitle);
                                resolve();
                            }
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });
});