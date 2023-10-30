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

                    const robotDetailWrapperElement = document.getElementById("robot-detail-wrapper");
                    robotDetailWrapperElement.getElementsByClassName("robot-id")[0].innerText = robotData.id;
                    robotDetailWrapperElement.getElementsByTagName("h2")[0].innerText = robotData.name;
                    const robotDetailTableElement = robotDetailWrapperElement.getElementsByClassName("robot-detail-table")[0];
                    robotDetailTableElement.innerHTML = `
                    <dl class = "robot-detail-table-row">
                        <dt>チーム名</dt><dd>${robotData.team}</dd>
                    </dl>
                    <dl class = "robot-detail-table-row">
                        <dt>所属</dt><dd>${robotData.belonging != undefined ? robotData.belonging: "-"}</dd>
                    </dl>
                    `;

                    const scoreWrapperElement = document.getElementById("score-wrapper");
                    if (robotData.result != undefined) {
                        robotScoreListData.forEach(scoreData => {
                            const scoreElement = document.createElement("div");
                            scoreElement.classList.add("score");
                            scoreElement.classList.add("score-" + scoreData.id);
                            const scoreResult = robotData.result[scoreData.id];
                            scoreElement.innerHTML = `
                            <h4>${scoreData.name}</h4>
                            <div class = "robot-detail-table">
                                <dl class = "robot-detail-table-row">
                                    <dt>得点</dt><dd>${scoreResult.sumPoint}点${scoreResult.judgePoint != undefined ? "（競技点：" + scoreResult.contestPoint + "点 / 審査点：" + scoreResult.judgePoint + "点）" : ""}</dd>
                                </dl>
                                <dl class = "robot-detail-table-row">
                                    <dt>競技時間</dt><dd>${scoreResult.contestTime}</dd>
                                </dl>
                            </div>
                            <div class = "accordion-wrapper">
                                <label class = "accordion-btn">
                                    <input type="checkbox">
                                    <div>スコア詳細</div>
                                </label>
                                <div class = "accordion-content">
                                    test<br>
                                    test
                                </div>
                            </div>
                            `;
                            scoreWrapperElement.appendChild(scoreElement);
                        });
                    }
                })
                .then(() => {
                    resolve();
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });
});