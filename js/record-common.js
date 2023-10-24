/* setting: 連想配列でrecord-setting.json内のcourseListを全コース分そのまま。 */
/* robotID: ゼッケン番号。コース判定もこれで行う。 */
/* pointString: 得点の文字列。配列ではなく各試技1回の文字列単体を。 */
function calculateScore(settings, robotID, pointString, debugMode = false) {
    // 対象の設定の読み込み
    let courseSetting = {};
    let result = 0;

    let debugTextArray = [];

    if (debugMode) {
        debugTextArray.push("Start judging course. robotID: " + robotID);
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
        debugTextArray.push("Start loading bonus rule.");
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