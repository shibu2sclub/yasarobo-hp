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
                        const courseListElement = document.createElement('ul');
                        courseListElement.classList.add('course-list');

                        for (let i = 0; (i < 3 && i < sortedCourseRobotList.length); i++) {
                            const robot = sortedCourseRobotList[i];
                            const robotElement = document.createElement('li');
                            robotElement.classList.add('robot');
                            const robotNameElement = document.createElement('h3');
                            robotNameElement.classList.add('robot-name');
                            robotNameElement.innerText = robot.name;
                            robotElement.appendChild(robotNameElement);
                            const robotPointElement = document.createElement('p');
                            robotPointElement.classList.add('robot-point');
                            robotPointElement.innerText = robot.result["12best"].sumPoint;
                            robotElement.appendChild(robotPointElement);
                            courseListElement.appendChild(robotElement);
                        }
                        courseElement.appendChild(courseListElement);

                        const courseMoreElement = document.createElement('a');
                        courseMoreElement.classList.add('course-more');
                        courseMoreElement.classList.add('internal-link');
                        courseMoreElement.setAttribute('href', `/record/ranking/?y=${pageYear}&c=${courseID}`);
                        courseMoreElement.innerText = "もっと見る";
                        courseElement.appendChild(courseMoreElement);

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