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
                        courseElement.setAttribute('class', 'course');
                        courseElement.setAttribute('id', courseID);
                        const courseTitleElement = document.createElement('h2');
                        courseTitleElement.setAttribute('class', 'course-title');
                        courseTitleElement.innerText = courseRule.name;
                        courseElement.appendChild(courseTitleElement);
                        const courseListElement = document.createElement('ul');
                        courseListElement.setAttribute('class', 'course-list');
                        sortedCourseRobotList.forEach(robot => {
                            const robotElement = document.createElement('li');
                            robotElement.setAttribute('class', 'robot');
                            const robotNameElement = document.createElement('h3');
                            robotNameElement.setAttribute('class', 'robot-name');
                            robotNameElement.innerText = robot.name;
                            robotElement.appendChild(robotNameElement);
                            const robotPointElement = document.createElement('p');
                            robotPointElement.setAttribute('class', 'robot-point');
                            robotPointElement.innerText = robot.result["12best"].sumPoint;
                            robotElement.appendChild(robotPointElement);
                            courseListElement.appendChild(robotElement);
                        });
                        courseElement.appendChild(courseListElement);
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