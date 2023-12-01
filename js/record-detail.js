function checkFileExistence(url) {
    return fetch(url,{cache: "no-store"})
}

async function loadImageFile(imageUrlWithoutExtension) {
    try {
        const robotImageElement = document.getElementById("robot-image");
        
        const ret1 = await checkFileExistence(imageUrlWithoutExtension + '.jpg');
        const ret2 = await checkFileExistence(imageUrlWithoutExtension + '.JPG');
        const ret3 = await checkFileExistence(imageUrlWithoutExtension + '.jpeg');
        const ret4 = await checkFileExistence(imageUrlWithoutExtension + '.png');
        const ret5 = await checkFileExistence(imageUrlWithoutExtension + '.webp');
        if (ret1.status == 200) {
            robotImageElement.src = `${imageUrlWithoutExtension}.jpg`;
            robotImageElement.style.display = "block";
            return 0;
        }
        if (ret2.status == 200) {
            robotImageElement.src = `${imageUrlWithoutExtension}.JPG`;
            robotImageElement.style.display = "block";
            return 0;
        }
        if (ret3.status == 200) {
            robotImageElement.src = `${imageUrlWithoutExtension}.jpeg`;
            robotImageElement.style.display = "block";
            return 0;
        }
        if (ret4.status == 200) {
            robotImageElement.src = `${imageUrlWithoutExtension}.png`;
            robotImageElement.style.display = "block";
            return 0;
        }
        if (ret5.status == 200) {
            robotImageElement.src = `${imageUrlWithoutExtension}.webp`;
            robotImageElement.style.display = "block";
            return 0;
        }
    }
    catch (error) {
        console.error('エラーが発生しました:', error);
    }
};

const generateRecordDetail = generateNavBGOverlay.then(() => {
    return new Promise((resolve, reject) => {
        const pageYear = checkYearParam();
        fetch(`/data/${pageYear}/record-setting.json`,{cache: "no-store"})
            .then(response => response.json())
            .then(recordSetting => {
                fetch(`/data/${pageYear}/record.json`,{cache: "no-store"})
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

                    if (robotData.category != undefined) {
                        robotDetailTableElement.innerHTML += `
                        <dl class = "robot-detail-table-row">
                            <dt>カテゴリ</dt><dd id = "category-list"></dd>
                        </dl>
                        `
                        const categoryListElement = document.getElementById("category-list");
                        robotData.category.forEach(category => {
                            const categoryElement = document.createElement("span");
                            categoryElement.innerText = category;
                            categoryListElement.appendChild(categoryElement);
                        });
                    }

                    if (robotData.size != undefined) {
                        let categoryString = "";
                        robotData.category.forEach(category => {
                            categoryString += category + " / ";
                        });
                        robotDetailTableElement.innerHTML += `
                        <dl class = "robot-detail-table-row">
                            <dt>サイズ</dt><dd>長さ: ${robotData.size.length}mm<br>横幅: ${robotData.size.width}mm<br>高さ: ${robotData.size.height}mm</dd>
                        </dl>
                        `
                    }

                    const robotDescWrapperElement = document.getElementById("robot-desc-wrapper");
                    if (robotData.feature != undefined) {
                        robotDescWrapperElement.innerHTML += `
                        <h3>ロボットの特徴</h3>
                        <p><budoux-ja>${robotData.feature}</budoux-ja></p>
                        `
                    }
                    
                    if (robotData.appeal != undefined) {
                        robotDescWrapperElement.innerHTML += `
                        <h3>アピールポイント</h3>
                        <p><budoux-ja>${robotData.appeal}</budoux-ja></p>
                        `
                    }

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
                            const scoreResult = robotData.result[scoreData.id];

                            if (scoreResult != undefined) { // 出場している試技のみ生成
                                const scoreElement = document.createElement("div");
                                scoreElement.classList.add("score");
                                scoreElement.classList.add("score-" + scoreData.id);
                                scoreElement.innerHTML = `
                                <h4>${scoreData.name}</h4>
                                <div class = "robot-detail-table robot-info">
                                </div>
                                <div class = "accordion-wrapper score-accordion-wrapper smaller">
                                    <label class = "accordion-btn">
                                        <input type="checkbox">
                                        <div>スコア詳細</div>
                                    </label>
                                    <div class = "accordion-content point-detail">
                                        <div class = "robot-detail-table"></div>
                                    </div>
                                </div>
                                `;
    
                                const scoreTableElement = scoreElement.getElementsByClassName("robot-detail-table")[0];
                                const scoreAcordionWrapperElement = scoreElement.getElementsByClassName("score-accordion-wrapper")[0];
                                if (scoreResult.sumPoint != undefined) {    // 得点が存在する場合
                                    scoreTableElement.innerHTML = `
                                    <dl class = "robot-detail-table-row">
                                        <dt>得点</dt><dd>${scoreResult.sumPoint}点${scoreResult.judgePoint != undefined ? "（競技点：" + scoreResult.contestPoint + "点 / 審査点：" + scoreResult.judgePoint + "点）" : ""}</dd>
                                    </dl>
                                    <dl class = "robot-detail-table-row">
                                        <dt>競技時間</dt><dd>${scoreResult.contestTime}</dd>
                                    </dl>
                                    `
                                    //if (scoreResult.retry > 0) {
                                        scoreTableElement.innerHTML += `
                                        <dl class = "robot-detail-table-row">
                                            <dt>リトライ</dt><dd>${scoreResult.retry}回</dd>
                                        </dl>
                                        `
                                    //}
                                }
                                else {  // 棄権などの場合
                                    scoreAcordionWrapperElement.style.display = "none";
                                    scoreTableElement.innerHTML = `
                                    <dl class = "robot-detail-table-row">
                                        <dt>得点</dt><dd>-${scoreResult.judgePoint != undefined ? "（競技点：- / 審査点：" + scoreResult.judgePoint + "点）" : ""}</dd>
                                    </dl>
                                    <dl class = "robot-detail-table-row">
                                        <dt>備考</dt><dd>${scoreResult.remark}</dd>
                                    </dl>
                                    `
                                }
    
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
                                    pointDetailElement.prepend(sourceNoticePElement);
                                }
    
                                const robotDetailTableElement = pointDetailElement.getElementsByClassName("robot-detail-table")[0];
                                const coursePointRules = robotCourseData.point;
                                if (scoreResult.contest != undefined) { // 棄権でない場合
                                    const scoreDataArray = calculateScore(recordSetting, robotData.id, scoreResult.contest[scoreResult.contest.length - 1]);
                                    const pointDetailData = scoreDataArray[1];
                                    const pointBonusAddedData = scoreDataArray[2];
    
                                    coursePointRules.forEach(pointRule => {
                                        const pointRuleElement = document.createElement("dl");
                                        pointRuleElement.classList.add("robot-detail-table-row");
                                        const pointNum = pointDetailData[pointRule.id] || 0;
                                        const pointBonusAdded = pointBonusAddedData[pointRule.id];
    
                                        if (pointRule.bonusType == undefined){
                                            pointRuleElement.innerHTML = `
                                            <dt>${pointRule.name}<span>各${pointRule.value}点${pointBonusAdded != pointRule.value ? "→" + String(pointBonusAdded) + "点" : ""}</span></dt>
                                            <dd>${pointNum}個（回）</dd><dd>${pointBonusAdded * pointNum}点</dd>
                                            `;
                                        }
                                        else {
                                            pointRuleElement.innerHTML = `
                                            <dt>${pointRule.name}</dt>
                                            <dd>${pointNum ? "有効" : "無効"}</dd>
                                            `;
                                            pointRuleElement.classList.add("bonus");
                                        }
                                        robotDetailTableElement.appendChild(pointRuleElement);
                                    });
                                }
                                scoreWrapperElement.appendChild(scoreElement);
                            }
                        });
                    }
                    loadImageFile(`/data/${pageYear}/robot-img/${robotData.id}`);
                })
                .then(() => {
                    resolve();
                })
                .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });
});