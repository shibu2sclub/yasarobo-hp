/* setting: 連想配列でrecord-setting.jsonをそのまま。 */
/* robotID: ゼッケン番号。コース判定もこれで行う。 */
/* pointString: 得点の文字列。配列ではなく各試技1回の文字列単体を。 */
function calculateScore(settings, robotID, pointString, debugMode = false) {
    settings = settings.courseList;
    
    // 対象の設定の読み込み
    let courseSetting = {};
    let result = 0;

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
            const duplicateCheck = enabledBonusRuleArray.filter((enabledBonusRule) => enabledBonusRule.id == containedRule[0].id)
            if (duplicateCheck.length == 0) enabledBonusRuleArray.push(containedRule[0]);
        }
	}
    
    if (debugMode) {
        debugTextArray.push("Loaded enabled bonus rule.");
        console.log(debugTextArray[debugTextArray.length - 1]);
        debugTextArray.push("Enabled bonus rule: " + enabledBonusRuleArray.length);
        console.log(debugTextArray[debugTextArray.length - 1]);
    }

    // 文字列ごとの加算
    for (let i = 0; i < pointString.length; i++) {
        let addPoint = 0;
        const pointSetting = courseSetting.point.filter((pointSettingBuff) => pointSettingBuff.id == pointString.charAt(i))[0];

        if (pointSetting.bonusType == undefined) {
            addPoint = pointSetting.value;
        
            if (debugMode) {
                debugTextArray.push("Added " + addPoint + " point(s). pointString: " + pointString.charAt(i));
                console.log(debugTextArray[debugTextArray.length - 1]);
                debugTextArray.push("Checking bonus rule.");
                console.log(debugTextArray[debugTextArray.length - 1]);
            }

            // ボーナス加算
            if (enabledBonusRuleArray.length > 0) {
                enabledBonusRuleArray.forEach(enabledBonusRule => {
                    const checkBonusTargetID = enabledBonusRule.targetID.filter((idBuff) => idBuff == pointString.charAt(i));
                    if (checkBonusTargetID.length > 0) {
                        if (debugMode) {
                            debugTextArray.push("Applied Bonus Rule: " + enabledBonusRule.id);
                            console.log(debugTextArray[debugTextArray.length - 1]);
                        }
                        if (enabledBonusRule.bonusType == "add") {
                            addPoint += enabledBonusRule.value;
                            if (debugMode) {
                                debugTextArray.push("Bonus: Added " + enabledBonusRule.value + " point(s). pointString: " + enabledBonusRule.id);
                                console.log(debugTextArray[debugTextArray.length - 1]);
                            }
                        }
                        else if (enabledBonusRule.bonusType == "multiply") {
                            addPoint *= enabledBonusRule.value;
                            if (debugMode) {
                                debugTextArray.push("Bonus: Multiplied " + enabledBonusRule.value + ". pointString: " + enabledBonusRule.id);
                                console.log(debugTextArray[debugTextArray.length - 1]);
                            }
                        }
                    }
                });
            }
            result += addPoint;
        }
        else {
            if (debugMode) {
                debugTextArray.push("Bonus rule detected. pointString: " + pointString.charAt(i));
                console.log(debugTextArray[debugTextArray.length - 1]);
            }
        }
    }

    if (debugMode) return [result, debugTextArray];
    else return result;
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
                const pointStringsArray = resultList[key].contest;
                const pointString = pointStringsArray[pointStringsArray.length - 1];
                const point = calculateScore(settings, robotID, pointString);

                record.result[key].contestPoint = point;
                if (record.result[key].judgePoint != undefined) record.result[key].sumPoint = point + record.result[key].judgePoint;
                else record.result[key].sumPoint = point;
            });

            // 算出点がある場合は、算出点を計算
            settings.scoreList.forEach(scoreSetting => {
                if (scoreSetting.calculateType != undefined) {
                    const calculateType = scoreSetting.calculateType;
                    if (calculateType == "best") {
                        // リスト内での最高点算出
                        let maxPoint = 0, maxPointContestPoint = 0, maxPointJudgePoint = 0; // 合計点が最大の時の各得点
                        scoreSetting.list.forEach(calcScoreID => {
                            if (record.result[calcScoreID] == undefined) console.error("Error: Score of " + calcScoreID + " is not defined. robotID: " + robotID);
                            else {
                                const point = record.result[calcScoreID].sumPoint;
                                if (point > maxPoint) {
                                    maxPoint = point;
                                    maxPointContestPoint = record.result[calcScoreID].contestPoint;
                                    if (record.result[calcScoreID].judgePoint != undefined) maxPointJudgePoint = record.result[calcScoreID].judgePoint;
                                    else maxPointJudgePoint = undefined;
                                }
                            }
                        });
                        record.result[scoreSetting.id] = {};
                        record.result[scoreSetting.id].sumPoint = maxPoint;
                        record.result[scoreSetting.id].contestPoint = maxPointContestPoint;
                        if (maxPointJudgePoint != undefined) record.result[scoreSetting.id].judgePoint = maxPointJudgePoint;
                    }
                }
            });
            robotList.push(record);
        }
    });
    return robotList;
}

// issue: 1条件のみでソートしている、2ndなどの条件に対応したい
/* robotList: ロボットリスト。事前にgenerateRobotListWithPointを通す必要がある。 */
/* sortKey: 仮対応、sortを行う試技のキーを指定 */
// issue: ソートについて1条件のみ対応
function sortRobotList(robotList, sortKey) {
    robotList.sort((a, b) => {
        if (a.result[sortKey].sumPoint > b.result[sortKey].sumPoint) return -1;
        else if (a.result[sortKey].sumPoint < b.result[sortKey].sumPoint) return 1;
        else return 0;
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
            fetch("/data/common.json")
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