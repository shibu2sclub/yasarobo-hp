/* setting: 連想配列でrecord-setting.jsonをそのまま。 */
/* robotID: ゼッケン番号。コース判定もこれで行う。 */
/* pointString: 得点の文字列。配列ではなく各試技1回の文字列単体を。 */
/* 出力: [得点. {各得点の回数・個数}, {各得点の点数}, デバッグ文章] */
function calculateScore(settings, robotID, pointString, debugMode = false) {
    settings = settings.courseList;
    
    // 対象の設定の読み込み
    let courseSetting = {};
    let result = [0, {}, ""];

    let debugTextArray = [];

    if (debugMode) {
        debugTextArray.push("Judging course. robotID: " + robotID);
        console.log(debugTextArray[debugTextArray.length - 1]);
    }
    settings.forEach(setting => {
        if (setting.id == robotID.charAt(0)) {
            courseSetting = setting;
        }
    });

    if (debugMode) {
        debugTextArray.push("Course: " + courseSetting.name);
        console.log(debugTextArray[debugTextArray.length - 1]);
        debugTextArray.push("Loading bonus rule.");
        console.log(debugTextArray[debugTextArray.length - 1]);
    }

    // ボーナス算出条件の確認、記録
    let bonusRuleArray = [];
    courseSetting.point.forEach(pointSetting => {
        if (pointSetting.bonusType != undefined) {
            bonusRuleArray.push(pointSetting);
        }
    });
    
    if (debugMode) {
        debugTextArray.push("Loaded bonus rule.");
        console.log(debugTextArray[debugTextArray.length - 1]);
        debugTextArray.push("Bonus rule: " + bonusRuleArray.length);
        console.log(debugTextArray[debugTextArray.length - 1]);
        debugTextArray.push("Loading enabled bonus rule.");
        console.log(debugTextArray[debugTextArray.length - 1]);
    }

    let enabledBonusRuleArray = [];
    // 文字読み込みによるボーナス算出条件有無確認
    for (let i = 0; i < pointString.length; i++) {
		const containedRule = bonusRuleArray.filter((bonusRule) => bonusRule.id == pointString.charAt(i));
        if (containedRule.length > 0) {
            if (result[1][containedRule[0].id] == undefined) result[1][containedRule[0].id] = 0;
            result[1][containedRule[0].id] = true;
            const duplicateCheck = enabledBonusRuleArray.filter((enabledBonusRule) => enabledBonusRule.id == containedRule[0].id)
            if (duplicateCheck.length == 0) {
                enabledBonusRuleArray.push(containedRule[0]);
                if (debugMode) {
                    debugTextArray.push("Enabled bonus rule: ", containedRule[0].id);
                    console.log(debugTextArray[debugTextArray.length - 1]);
                }
            }
        }
	}
    
    if (debugMode) {
        debugTextArray.push("Loaded enabled bonus rule.");
        console.log(debugTextArray[debugTextArray.length - 1]);
    }


    // ボーナス得点の反映
    let bonusAddedPoint = {};
    courseSetting.point.forEach(pointSetting => {
        bonusAddedPoint[pointSetting.id] = pointSetting.value;
        enabledBonusRuleArray.forEach(enabledBonusRule => {
            if (enabledBonusRule.targetID.filter(targetID => targetID == pointSetting.id).length > 0) {
                if (enabledBonusRule.bonusType == "add") bonusAddedPoint[pointSetting.id] += enabledBonusRule.value;
                else if (enabledBonusRule.bonusType == "multiply") bonusAddedPoint[pointSetting.id] *= enabledBonusRule.value;
            }
        });
        if (debugMode) {
            debugTextArray.push("Bonus Added: ", pointSetting.id, " ", bonusAddedPoint[pointSetting.id]);
            console.log(debugTextArray[debugTextArray.length - 1]);
        }
    });

    // 文字列ごとの加算
    for (let i = 0; i < pointString.length; i++) {
        let addPoint = 0;
        const pointSetting = courseSetting.point.filter((pointSettingBuff) => pointSettingBuff.id == pointString.charAt(i))[0];
        if (pointSetting == undefined) {
            if (debugMode) {
                debugTextArray.push("Error: Point setting of " + pointString.charAt(i) + " is not defined. robotID: " + robotID);
                console.error(debugTextArray[debugTextArray.length - 1]);
            }
        }
        else if (pointSetting.bonusType == undefined) {
            if (result[1][pointSetting.id] == undefined) result[1][pointSetting.id] = 0;
            result[1][pointSetting.id]++;
        
            if (debugMode) {
                debugTextArray.push("Added " + addPoint + " point(s). pointString: " + pointString.charAt(i));
                console.log(debugTextArray[debugTextArray.length - 1]);
                debugTextArray.push("Checking bonus rule.");
                console.log(debugTextArray[debugTextArray.length - 1]);
            }
            result[0] += bonusAddedPoint[pointSetting.id];
        }
        else {
            if (debugMode) {
                debugTextArray.push("Bonus rule detected. pointString: " + pointString.charAt(i));
                console.log(debugTextArray[debugTextArray.length - 1]);
            }
        }
    }

    result[2] = bonusAddedPoint;
    if (debugMode) result[3] = debugTextArray;
    return result;
}

function timeConvertStringToMsec(timeString) {
    return Number(timeString.split(':')[0]) * 60 * 1000 + Number(timeString.split(':')[1]) * 1000 + Number(timeString.split(':')[2]) * 10;
}

function timeConvertStringToJPString(timeString) {
    return Number(timeString.split(':')[0]) + "分" + Number(timeString.split(':')[1]) + "秒" + timeString.split(':')[2];
}

function timeConvertMsecToString(msec) {
    return `${String(Math.floor(msec / 60000)).padStart(2, "0")}:${String(Math.floor(msec % 60000 / 1000)).padStart(2, "0")}:${String(Math.floor(msec % 1000 / 10)).padStart(2, "0")}`;
}

/* setting: 連想配列でrecord-setting.jsonをそのまま。 */
/* recordJSON: record.jsをそのまま */
/* courseID: 1文字ならコースを指定、3文字（2文字以上）ならゼッケン番号を指定 */
function generateRobotListWithPoint(settings, recordJSON, courseID) {
    let robotList = [];
    recordJSON.forEach(record => {
        const robotID = record.id;
        const resultList = record.result;

        // コースがあっているときのみ or ゼッケン番号があっているときのみ
        if ((courseID.length == 1 && robotID.charAt(0) == courseID) || (courseID.length > 1 && robotID == courseID)) {
            Object.keys(resultList).forEach(key => {
                const contestResult = resultList[key];
                const pointString = contestResult.contest;

                if (pointString != undefined) {
                    const point = calculateScore(settings, robotID, pointString)[0];

                    record.result[key].contestPoint = point;
                    if (record.result[key].judgePoint != undefined) record.result[key].sumPoint = point + record.result[key].judgePoint;
                    else record.result[key].sumPoint = point;
    
                    const scoreSetting = settings.scoreList.filter(scoreSettings => scoreSettings.id == key)[0];
                    const scoreRuleTimeMsec = timeConvertStringToMsec(scoreSetting.time);
                    const scoreRemainTimeMsec = timeConvertStringToMsec(contestResult.remainTime);
    
                    const scoreContestTimeMsec = scoreRuleTimeMsec - scoreRemainTimeMsec;
                    record.result[key].contestTime = timeConvertMsecToString(scoreContestTimeMsec);
                    if (record.result[key].retry == undefined) record.result[key].retry = 0;
                }
            });

            // 算出点がある場合は、算出点を計算
            settings.scoreList.forEach(scoreSetting => {
                if (scoreSetting.calculateType != undefined) {
                    const calculateType = scoreSetting.calculateType;
                    if (calculateType == "best") {
                        // リスト内での最高点算出
                        let maxPoint = -1, maxPointContestPoint = -1, maxPointJudgePoint = -1, maxPointContestTime = "", maxPointSource = "", maxPointPointString = [], maxPointRetry = 0; // 合計点が最大の時の各得点
                        scoreSetting.list.forEach(calcScoreID => {
                            if (record.result[calcScoreID] == undefined) console.error("Error: Score of " + calcScoreID + " is not defined. robotID: " + robotID);
                            else {
                                const point = record.result[calcScoreID].sumPoint;
                                if (point > maxPoint) {
                                    maxPoint = point;
                                    maxPointSource = calcScoreID;
                                    const contestResult = record.result[calcScoreID];
                                    maxPointContestPoint = contestResult.contestPoint;
                                    maxPointContestTime = contestResult.contestTime;
                                    maxPointPointString = contestResult.contest;
                                    maxPointRetry = contestResult.retry;
                                    if (record.result[calcScoreID].judgePoint != undefined) maxPointJudgePoint = contestResult.judgePoint;
                                    else maxPointJudgePoint = undefined;
                                }
                            }
                        });
                        record.result[scoreSetting.id] = {};
                        if (maxPoint != -1) {
                            record.result[scoreSetting.id].sumPoint = maxPoint;
                            record.result[scoreSetting.id].source = maxPointSource;
                            record.result[scoreSetting.id].contestPoint = maxPointContestPoint;
                            record.result[scoreSetting.id].contestTime = maxPointContestTime;
                            record.result[scoreSetting.id].contest = maxPointPointString;
                            record.result[scoreSetting.id].retry = maxPointRetry;
                            if (maxPointJudgePoint != undefined) record.result[scoreSetting.id].judgePoint = maxPointJudgePoint;
                        }
                    }
                    else if (calculateType == "sum") {
                        // リスト内での合計点算出
                        let sumPoint = 0, sumPointContestPoint = 0, sumPointJudgePoint = 0, sumPointContestTime = ""; // 合計点が最大の時の各得点
                        scoreSetting.list.forEach(calcScoreID => {
                            if (record.result[calcScoreID] == undefined) console.error("Error: Score of " + calcScoreID + " is not defined. robotID: " + robotID);
                            else {
                                const point = record.result[calcScoreID].sumPoint;
                                sumPoint += point;
                                sumPointContestPoint += record.result[calcScoreID].contestPoint;
                                //sumPointContestTime = record.result[calcScoreID].contestTime;
                                if (record.result[calcScoreID].judgePoint != undefined) sumPointJudgePoint += record.result[calcScoreID].judgePoint;
                                else sumPointJudgePoint = undefined;
                            }
                        });
                        record.result[scoreSetting.id] = {};
                        record.result[scoreSetting.id].sumPoint = sumPoint;
                        record.result[scoreSetting.id].contestPoint = sumPointContestPoint;
                        //record.result[scoreSetting.id].contestTime = sumPointContestTime;
                        if (sumPointJudgePoint != undefined) record.result[scoreSetting.id].judgePoint = sumPointJudgePoint;
                    }
                }
            });
            robotList.push(record);
        }
    });
    return robotList;
}

/* robotList: ロボットリスト。事前にgenerateRobotListWithPointを通す必要がある。 */
/* sortContest: sortを行う試技のキーを指定。1つだけ。 */
/* sortKey: sortを行う項目名。順番に配列。対象はゼッケン番号などの試技に関係ないものと、競技点など試技に関係あるものの両方。 */
function sortRobotList(settings, robotList, sortContest, sortKey) {
    // 優先度の高い順に試技をソート
    if (sortContest == undefined) {
        const priorityOrderedScoreList = settings.scoreList.sort((a, b) => a.priority - b.priority);
        const priorityOrderedScoreIDList = priorityOrderedScoreList.map(score => score.id);

        sortContest = [priorityOrderedScoreIDList[0]];
        sortKey = ["sumPoint", "!contestTime", "!id"];
    }
    robotList = robotList.filter(robot => robot.result[sortContest] != undefined);  // 試技がないロボットを除外
    robotList.sort((a, b) => {
        for (let i = 0; i < sortKey.length; i++) {
            const sortKeyOrderAsc = (sortKey[i].charAt(0) == "!");    // trueなら昇順、falseなら降順。キーの1文字目に!がついている場合は昇順。
            const sortKeyCurrent = sortKey[i].replace("!", "");
            const sortKeyMode = (["sumPoint", "contestPoint", "judgePoint", "contestTime", "order"].filter(sortKeyContestAffect => sortKeyContestAffect == sortKeyCurrent).length > 0);    // trueなら試技に関係あるもの、falseなら試技に関係ないもの
            if ((sortKeyMode && a.result[sortContest][sortKeyCurrent] == undefined && b.result[sortContest][sortKeyCurrent] != undefined) || (!sortKeyMode && (a[sortKeyCurrent] == undefined && b[sortKeyCurrent] != undefined))) return 1;
            else if (sortKeyMode && (a.result[sortContest][sortKeyCurrent] != undefined && b.result[sortContest][sortKeyCurrent] == undefined) || (!sortKeyMode && (a[sortKeyCurrent] != undefined && b[sortKeyCurrent] == undefined))) return -1;
            else if (sortKeyMode && (a.result[sortContest][sortKeyCurrent] != undefined && b.result[sortContest][sortKeyCurrent] != undefined) || (!sortKeyMode && (a[sortKeyCurrent] != undefined && b[sortKeyCurrent] != undefined))) {
                if ((sortKeyMode && a.result[sortContest][sortKeyCurrent] > b.result[sortContest][sortKeyCurrent]) || (!sortKeyMode && (a[sortKeyCurrent] > b[sortKeyCurrent]))) return sortKeyOrderAsc ? 1 : -1;
                else if (sortKeyMode && (a.result[sortContest][sortKeyCurrent] < b.result[sortContest][sortKeyCurrent]) || (!sortKeyMode && (a[sortKeyCurrent] < b[sortKeyCurrent]))) return sortKeyOrderAsc ? -1 : 1;
            }
            if (i == (sortKey.length - 1)) return 0;
        }
    });
    return robotList;
}

const recordUrlCheckAddYear = loadSiteYear.then(() => {
    new Promise((resolve, reject) => {
        const paramY = getParam("y");
        if (paramY == null) {
            const pageYear = checkYearParam();
            const paramString = `?y=${pageYear}`;
            history.replaceState('', '', paramString);
        }
        // 最新年以外は過去年のリストと比較して正しい年かを確認、だめなら404へ
        else {
            // fetch common.json and compare paramY with pastYears list in common.json
            // if paramY is not in pastYears list, redirect to error page
            fetch("/data/common.json",{cache: "no-store"})
                .then(response => response.json())
                .then(commonJSON => {
                    const pastYears = commonJSON.pastYears;
                    if (pastYears.indexOf(Number(paramY)) == -1) {
                        location.href = "/404/";
                    }
                })
                .catch(error => console.error(error));
        }
        resolve();
    });
});

const generateRecordHeadMenu = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();
        fetch(`/data/${pageYear}/record-setting.json`,{cache: "no-store"})
            .then(response => response.json())
            .then(recordSetting => {
                const recordHeadMenuElement = document.getElementById('record-head-menu');
                const recordHeadMenuListElement = document.createElement('ul');
                recordHeadMenuListElement.classList.add('record-head-menu');
                
                // 受賞者ページがある場合は受賞者ページへのリンクを追加
                if (recordSetting.showAward) recordHeadMenuListElement.innerHTML = `<li><a href = "/record/?y=${pageYear}">受賞者</a></li>`;
                recordSetting.courseList.forEach(courseData => {
                    const courseElement = document.createElement('li');
                    const courseLinkElement = document.createElement('a');
                    //courseLinkElement.classList.add('internal-link');
                    courseLinkElement.setAttribute('href', `/record/ranking/?y=${pageYear}&c=${courseData.id}`);
                    courseLinkElement.innerText = courseData.name;
                    courseElement.appendChild(courseLinkElement);
                    recordHeadMenuListElement.appendChild(courseElement);
                });

                // 開いているページに関係するliを太字にする
                recordHeadMenuListElement.querySelectorAll('li').forEach(liElement => {
                    const aElement = liElement.querySelector('a');

                    let currentURLCourseParam = null;
                    if (getParam('c') != null) currentURLCourseParam = getParam('c')
                    else if (getParam('r') != null) currentURLCourseParam = getParam('r').charAt(0);
                    if ((location.pathname == '/record/' || location.pathname == '/record/index.html') && aElement.getAttribute('href') == `/record/?y=${pageYear}`) {
                        liElement.classList.add('active');
                    }
                    else if ((currentURLCourseParam != null && aElement.getAttribute('href') == `/record/ranking/?y=${pageYear}&c=${currentURLCourseParam}`)) {
                        liElement.classList.add('active');
                    }
                });

                recordHeadMenuElement.appendChild(recordHeadMenuListElement);
            })
            .then(() => {
                resolve();
            })
            .catch(error => console.error(error));
    });
});