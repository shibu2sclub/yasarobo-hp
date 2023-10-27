function generateTableElement(robotList, scoreRuleID) {
    const recordRankingTableElement = document.createElement("table");
    recordRankingTableElement.id = scoreRuleID;
    recordRankingTableElement.innerHTML = `
        <thead>
            <tr>
                <th class = "order">走順</th>
                <th class = "robot-id">番号</th>
                <th class = "robot-name">ロボット名</th>
                <th class = "team-name">チーム名</th>
                <th class = "belonging-name">所属</th>
                <th class = "sum-point">得点</th>
                <th class = "contest-point">競技点</th>
                <th class = "judge-point">審査点</th>
                <th class = "contest-time">競技時間</th>
                <th class = "remark">備考</th>
            </tr>
        </thead>
    `;
    recordRankingTableBodyElement = document.createElement("tbody");
    
    robotList.forEach(robot => {
        const rowElement = document.createElement("tr");
        rowElement.innerHTML = `
            <td class = "order">${robot.order}</td>
            <td class = "robot-id">${robot.id}</td>
            <td class = "robot-name">${robot.name}</td>
            <td class = "team-name">${robot.team}</td>
            <td class = "belonging-name">${robot.belonging}</td>
            <td class = "sum-point">${robot.result[scoreRuleID].sumPoint}</td>
            <td class = "contest-point">${robot.result[scoreRuleID].contestPoint}</td>
            <td class = "judge-point">${robot.result[scoreRuleID].judgePoint}</td>
            <td class = "contest-time">${robot.result[scoreRuleID].contestTime}</td>
            <td class = "remark">${robot.remark ? robot.remark != undefined : ""}</td>
        `;
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

const generateRecordRanking = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();
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