const generateRecordList = generateNavBGOverlay.then(() => {
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

                        const courseRobotList = generateRobotListWithPoint(recordSetting, recordJSON, courseID);
                        const sortedCourseRobotList = sortRobotList(courseRobotList, "12best");    // issue: 1条件のみでソートしている

                        const recordListElement = document.getElementById('record-list');
                        const courseElement = document.createElement('div');
                        courseElement.classList.add('course');
                        courseElement.id = courseID;
                        const courseTitleElement = document.createElement('h2');
                        courseTitleElement.classList.add('course-title');
                        courseTitleElement.innerText = courseRule.name;
                        courseElement.appendChild(courseTitleElement);
                        const courseRobotListElement = document.createElement('div');
                        courseRobotListElement.classList.add('course-robot-list-container');

                        for (let i = 0; (i < 2 && i < sortedCourseRobotList.length); i++) {
                            const robot = sortedCourseRobotList[i];
                            const robotElement = document.createElement('div');
                            robotElement.classList.add('robot');
                            const robotLinkElement = document.createElement('a');
                            robotLinkElement.classList.add('robot-link');
                            robotLinkElement.setAttribute('href', `/record/detail/?y=${pageYear}&r=${robot.id}`);
                            const robotNameElement = document.createElement('h3');
                            robotNameElement.classList.add('robot-name');
                            robotNameElement.innerText = robot.name;
                            robotLinkElement.appendChild(robotNameElement);
                            const robotPointElement = document.createElement('p');
                            robotPointElement.classList.add('robot-point');
                            robotPointElement.innerText = robot.result["12best"].sumPoint;
                            robotLinkElement.appendChild(robotPointElement);
                            robotElement.appendChild(robotLinkElement);
                            courseRobotListElement.appendChild(robotElement);
                        }
                        const courseMoreElement = document.createElement('a');
                        courseMoreElement.classList.add('course-more');
                        courseMoreElement.classList.add('internal-link');
                        courseMoreElement.setAttribute('href', `/record/ranking/?y=${pageYear}&c=${courseID}`);
                        courseMoreElement.innerText = "もっと見る";
                        courseRobotListElement.appendChild(courseMoreElement);
                        courseElement.appendChild(courseRobotListElement);
                        recordListElement.appendChild(courseElement);
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