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

                    const baseRuleElement = document.getElementById("base-rule");
                    robotCourseData.baseRuleDesc.forEach(baseRuleDesc => {
                        const descPElement = document.createElement("p");
                        const descPInnerElement = document.createElement("budoux-ja");
                        descPInnerElement.innerHTML = baseRuleDesc;
                        descPElement.appendChild(descPInnerElement);
                        baseRuleElement.appendChild(descPElement);
                    });
                    const pointRuleElement = document.getElementById("point-rule");
                    robotCourseData.pointRuleDesc.forEach(pointRuleDesc => {
                        const descPElement = document.createElement("p");
                        const descPInnerElement = document.createElement("budoux-ja");
                        descPInnerElement.innerHTML = pointRuleDesc;
                        descPElement.appendChild(descPInnerElement);
                        pointRuleElement.appendChild(descPElement);
                    });

                    const scoreWrapperElement = document.getElementById("score-wrapper");
                    if (robotData.result != undefined) {
                        robotScoreListData.forEach(scoreData => {
                            const scoreElement = document.createElement("div");
                            scoreElement.classList.add("score");
                            scoreElement.classList.add("score-" + scoreData.id);
                            const scoreResult = robotData.result[scoreData.id];
                            scoreElement.innerHTML = `
                            <h4>${scoreData.name}</h4>
                            <div class = "robot-detail-table robot-info">
                                <dl class = "robot-detail-table-row">
                                    <dt>得点</dt><dd>${scoreResult.sumPoint}点${scoreResult.judgePoint != undefined ? "（競技点：" + scoreResult.contestPoint + "点 / 審査点：" + scoreResult.judgePoint + "点）" : ""}</dd>
                                </dl>
                                <dl class = "robot-detail-table-row">
                                    <dt>競技時間</dt><dd>${scoreResult.contestTime}</dd>
                                </dl>
                            </div>
                            <div class = "accordion-wrapper smaller">
                                <label class = "accordion-btn">
                                    <input type="checkbox">
                                    <div>スコア詳細</div>
                                </label>
                                <div class = "accordion-content">
                                    <div class = "robot-detail-table point-detail"></div>
                                </div>
                            </div>
                            `;
                            const robotInfoElement = scoreElement.getElementsByClassName("robot-info")[0];

                            let sourceName = undefined;
                            if (scoreResult.source != undefined) {
                                sourceName = robotScoreListData.filter(scoreDataBuff => scoreDataBuff.id == scoreResult.source)[0].name;
                                const sourceElement = document.createElement("dl");
                                sourceElement.classList.add("robot-detail-table-row");
                                sourceElement.innerHTML = `
                                <dt>達成試技</dt>
                                <dd>${sourceName}</dd>
                                `;
                                robotInfoElement.appendChild(sourceElement);
                            }
                            const pointDetailElement = scoreElement.getElementsByClassName("point-detail")[0];
                            if (scoreResult.source != undefined) {
                                const sourceNoticePElement = document.createElement("p");
                                sourceNoticePElement.classList.add("source-notice");
                                sourceNoticePElement.innerHTML = `<budoux-ja>以下のデータは得点を達成した「${sourceName}」の結果をもとに表示しています。</budoux-ja>`;
                                pointDetailElement.appendChild(sourceNoticePElement);
                            }
                            const coursePointRules = robotCourseData.point;
                            coursePointRules.forEach(pointRule => {
                                const pointRuleElement = document.createElement("dl");
                                pointRuleElement.classList.add("robot-detail-table-row");
                                const pointStringNum = (scoreResult.contest[scoreResult.contest.length - 1].match(new RegExp(pointRule.id, "g")) || []).length;
                                pointRuleElement.innerHTML = `
                                <dt>${pointRule.name}<span>各${pointRule.value}点</span></dt>
                                <dd>${pointStringNum}個（回）</dd><dd>${pointStringNum * pointRule.value}点</dd>
                                `;
                                pointDetailElement.appendChild(pointRuleElement);
                            });
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