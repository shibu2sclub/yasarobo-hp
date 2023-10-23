/* setting: 連想配列でrecord-setting.json内のcourseSetting.jsonを全コース分そのまま。 */
/* robotID: ゼッケン番号。コース判定もこれで行う。 */
/* pointString: 得点の文字列。配列ではなく各試技1回の文字列単体を。 */
function calculateScore(settings, robotID, pointString) {
    // 対象の設定の読み込み
    let courseSetting = {};
    settings.forEach(setting => {
        if (setting.id == robotID.charAt(0)) {
            courseSetting = setting;
        }
    });

    // ボーナス算出条件の確認、記録
    let bonusIDArray = [];
    courseSetting.point.forEach(pointSetting => {
        if (pointSetting.bonusType != undefined) {
            bonusIDArray.push(pointSetting.id);
        }
    });

    let enabledBonusIDArray = [];
    // 文字読み込みによるボーナス算出条件有無確認
    for (let i = 0; i < pointString.length; i++) {
		const result = bonusIDArray.filter((bonusID) => bonusID == pointString.charAt(i));
        if (result.length > 0) {
            const duplicateCheck = enabledBonusIDArray.filter((enabledBonusID) => enabledBonusID == result[0])
            if (duplicateCheck.length == 0) enabledBonusIDArray.push(result[0]);
        }
	}

    // 文字列ごとの加算
    for (let i = 0; i < pointString.length; i++) {
        
    }
}