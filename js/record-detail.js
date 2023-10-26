const generateRecordDetail = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();
        fetch(`/data/${pageYear}/record-setting.json`)
            .then(response => response.json())
            .then(recordSetting => {
                fetch(`/data/${pageYear}/record.json`)
                .then(response => response.json())
                .then(recordJSON => {
                    const robotData = generateRobotListWithPoint(recordSetting, recordJSON, getParam("r"))[0];
                    const robotCourseData = recordSetting.courseList.filter(courseData => courseData.id == robotData.id.charAt(0))[0];  // ロボットのコース情報
                    const robotScoreListData = recordSetting.scoreList; // スコアリスト

                    const recordDetailElement = document.getElementById('record-detail');
                    const robotNameElement = document.createElement('h2');
                    robotNameElement.classList.add('robot-name');
                    robotNameElement.innerText = robotData.name;
                    recordDetailElement.appendChild(robotNameElement);
                    const robotCourseElement = document.createElement('h3');
                    robotCourseElement.classList.add('robot-course');
                    robotCourseElement.innerText = robotCourseData.name;
                    recordDetailElement.appendChild(robotCourseElement);
                    const robotScoreListElement = document.createElement('ul');
                    robotScoreListElement.classList.add('robot-score-list');
                    robotScoreListData.forEach(scoreData => {
                        const scoreElement = document.createElement('li');
                        scoreElement.classList.add('robot-score');
                        const scoreTitleElement = document.createElement('h4');
                        scoreTitleElement.classList.add('robot-score-title');
                        scoreTitleElement.innerText = scoreData.name;
                        scoreElement.appendChild(scoreTitleElement);
                        const scorePointElement = document.createElement('p');
                        scorePointElement.classList.add('robot-score-point');
                        scorePointElement.innerText = robotData.result[scoreData.id].sumPoint;
                        scoreElement.appendChild(scorePointElement);
                        robotScoreListElement.appendChild(scoreElement);
                    });
                    recordDetailElement.appendChild(robotScoreListElement);                    
                })
                .then(() => {
                    resolve();
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });
});