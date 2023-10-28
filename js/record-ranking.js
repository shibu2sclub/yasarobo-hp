const generateRecordRanking = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();

        function generateTableElement(robotList, scoreRuleID) {
            const recordRankingTableElement = document.createElement("table");
            recordRankingTableElement.id = scoreRuleID;
            recordRankingTableElement.innerHTML = `
                <thead>
                    <tr>
                        <th class = "order"><a>走順</a></th>
                        <th class = "robot-id"><a>番号</a></th>
                        <th class = "robot-name"><a>ロボット名</a></th>
                        <th class = "team-name"><a>チーム名</a></th>
                        <th class = "belonging-name"><a>所属</a></th>
                        <th class = "sum-point"><a>得点</a></th>
                        <th class = "contest-point"><a>競技点</a></th>
                        <th class = "judge-point"><a>審査点</a></th>
                        <th class = "contest-time"><a>競技時間</a></th>
                        <th class = "remark"><a>備考</a></th>
                    </tr>
                </thead>
            `;
            recordRankingTableBodyElement = document.createElement("tbody");
            
            robotList.forEach(robot => {
                const rowElement = document.createElement("tr");
                /*rowElement.innerHTML = `
                    <td class = "order"><a>${robot.order}</a></td>
                    <td class = "robot-id"><a>${robot.id}</a></td>
                    <td class = "robot-name"><a>${robot.name}</a></td>
                    <td class = "team-name"><a>${robot.team}</a></td>
                    <td class = "belonging-name"><a>${robot.belonging}</a></td>
                    <td class = "sum-point"><a>${robot.result[scoreRuleID].sumPoint}</a></td>
                    <td class = "contest-point"><a>${robot.result[scoreRuleID].contestPoint}</a></td>
                    <td class = "judge-point"><a>${robot.result[scoreRuleID].judgePoint}</a></td>
                    <td class = "contest-time"><a>${robot.result[scoreRuleID].contestTime}</a></td>
                    <td class = "remark"><a>${robot.remark ? robot.remark != undefined : ""}</a></td>
                `;*/
                rowElement.innerHTML = `
                    <td class = "order">${robot.order}</td>
                    <td class = "robot-id">${robot.id}</td>
                    <td class = "robot-name"><a>${robot.name}</a></td>
                    <td class = "team-name">${robot.team}</td>
                    <td class = "belonging-name">${robot.belonging}</td>
                    <td class = "sum-point">${robot.result[scoreRuleID].sumPoint}</td>
                    <td class = "contest-point">${robot.result[scoreRuleID].contestPoint}</td>
                    <td class = "judge-point">${robot.result[scoreRuleID].judgePoint}</td>
                    <td class = "contest-time">${robot.result[scoreRuleID].contestTime}</td>
                    <td class = "remark">${robot.remark ? robot.remark != undefined : ""}</td>
                `;
                tdLinkElementsArray = Array.from(rowElement.getElementsByTagName("a"));
                tdLinkElementsArray.forEach(linkElement => {
                    linkElement.setAttribute("href", `/record/detail/?y=${pageYear}&r=${robot.id}`);
                });
                recordRankingTableBodyElement.appendChild(rowElement);
            });
            recordRankingTableElement.appendChild(recordRankingTableBodyElement);
            
            if (robotList[0].result[scoreRuleID].order == undefined) {
                Array.from(recordRankingTableElement.getElementsByClassName("order")).forEach(judgePointElement => judgePointElement.style.display = "none");
            }
            if (robotList[0].result[scoreRuleID].judgePoint == undefined) {
                Array.from(recordRankingTableElement.getElementsByClassName("contest-point")).forEach(judgePointElement => judgePointElement.style.display = "none");
                Array.from(recordRankingTableElement.getElementsByClassName("judge-point")).forEach(judgePointElement => judgePointElement.style.display = "none");
            }
            if (robotList[0].result[scoreRuleID].contestTime == undefined) {
                Array.from(recordRankingTableElement.getElementsByClassName("contest-time")).forEach(judgePointElement => judgePointElement.style.display = "none");
            }
        
            return recordRankingTableElement;
        }

        fetch(`/data/${pageYear}/record-setting.json`)
            .then(response => response.json())
            .then(recordSetting => {
                fetch(`/data/${pageYear}/record.json`)
                .then(response => response.json())
                .then(recordJSON => {
                    recordSetting.courseList.forEach(courseRule => {
                        const courseID = courseRule.id;

                        // paramで指定されたコースか
                        if (courseID == getParam("c")) {
                            const courseRobotList = generateRobotListWithPoint(recordSetting, recordJSON, courseID);

                            const h2CourseNameElement = document.getElementById("h2-course-name");
                            h2CourseNameElement.innerText = courseRule.name;

                            const recordRankingSelectMenuElement = document.getElementById("record-ranking-select-menu");
                            const recordRankingTablesElement = document.getElementById("record-ranking-tables");
                            recordSetting.scoreList.forEach(scoreRule => {
                                const sortedCourseRobotList = sortRobotList(recordSetting, courseRobotList, scoreRule.id);    // issue: 1条件のみでソートしている

                                const recordRankingBtn = document.createElement("li");
                                recordRankingBtn.setAttribute("target-score", scoreRule.id);
                                if (scoreRule.id == recordSetting.scoreList[0].id) recordRankingBtn.classList.add("active");
                                const recordRankingBtnA = document.createElement("a");
                                recordRankingBtnA.setAttribute("href", "#");
                                recordRankingBtnA.innerText = scoreRule.name;
                                recordRankingBtn.appendChild(recordRankingBtnA);
                                recordRankingSelectMenuElement.appendChild(recordRankingBtn);

                                const recordRankingTableBodyElement = generateTableElement(sortedCourseRobotList, scoreRule.id);
                                if (scoreRule.id == recordSetting.scoreList[0].id) recordRankingTableBodyElement.classList.add("active");
                                recordRankingTablesElement.appendChild(recordRankingTableBodyElement);
                            });
                        }
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

const addToggleContestEvent = generateRecordRanking.then(() => {
    return new Promise((resolve, reject) => {
        const recordRankingSelectMenuElement = document.getElementById("record-ranking-select-menu");
        const recordRankingSelectMenuButtonElementArray = Array.from(recordRankingSelectMenuElement.getElementsByTagName("li"));
        recordRankingSelectMenuButtonElementArray.forEach(button => {
            button.addEventListener("click", function(e) {
                e.preventDefault();

                const targetScoreID = button.getAttribute("target-score");
                const rankingTablesElement = document.getElementById("record-ranking-tables");
                const targetRankingTableElement = document.getElementById(targetScoreID);
                const activeRankingTableElement = rankingTablesElement.getElementsByClassName("active")[0];

                if (!targetRankingTableElement.classList.contains("active")) {
                    activeRankingTableElement.classList.remove("active");
                    targetRankingTableElement.classList.add("active");
                    recordRankingSelectMenuButtonElementArray.forEach(buttonBuff => {   
                        buttonBuff.classList.remove("active");
                    });
                    button.classList.add("active");
                }
            });
        });
    });
});