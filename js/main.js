(() => {

    let yOffset = 0; //window.pageYOffset 대신 사용
    let prevScrollHeight = 0; //현재 스크롤 보다 높은 값의 섹션들의 높이 합
    let currentScene = 0; //현재 씬
    let enterNweScene = false; //세로운 신이 시작되는 순간 true

    const sceneInfo = [
        {
            //0
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values: {
                messageA_opacity_in: [
                    0,
                    1, {
                        start: 0.1,
                        end: 0.2
                    }
                ],
                messageA_translateY_in: [
                    20,
                    0, {
                        start: 0.1,
                        end: 0.2
                    }
                ],
                messageA_opacity_out: [
                    1,
                    0, {
                        start: 0.25,
                        end: 0.3
                    }
                ],
                messageA_translateY_out: [
                    0,
                    -20, {
                        start: 0.25,
                        end: 0.3
                    }
                ]
            }
        }, {
            //1
            type: 'nomal',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        }, {
            //2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        }, {
            //3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    // 각 스크롤 섹션의 높이를 세팅함
    function setLayout() {
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if (sceneInfo[i].type === 'nomal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`

        }

        let totalScrollHeight = 0;

        yOffset = window.pageYOffset;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }

        document
            .body
            .setAttribute('id', `show-scene-${currentScene}`);

    }

    //현재 스크롤이 어떤 신의 어느 위치인지 나타내기
    function calValues(values, currentYoffset) {
        let returnValues;

        //%로 어느 위치인지 나타내기
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYoffset / scrollHeight;

        if (values.length === 3) {
            //start,end사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHight = partScrollEnd - partScrollStart;

            if (currentYoffset >= partScrollStart && currentYoffset <= partScrollEnd) {
                returnValues = (currentYoffset - partScrollStart) / partScrollHight * (
                    values[1] - values[0]
                ) + values[0];

            } else if (currentYoffset < partScrollStart) {
                returnValues = values[0];
            } else if (currentYoffset > partScrollEnd) {
                returnValues = values[1];
            }
        } else {
            //범위의 차 곱하고 초기값 더해주면 현재 위치 나옴.
            returnValues = scrollRatio * (values[1] - values[0]) + values[0];
        }

        return returnValues;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs; //실제 나타날 메시지를 담음
        const values = sceneInfo[currentScene].values; //현재 씬의 애니메이션 값을 저장함
        const currentYOffset = yOffset - prevScrollHeight; //현재 신의 스크롤 위치를 저장함(크기)
        const scrollHeight = sceneInfo[currentScene].scrollHeight; //현재 신만의 스크롤 높이를 저장
        const scrollRatio = currentYOffset / scrollHeight; //현재 신의 스크롤 위치를 저장(비율)

        switch (currentScene) {
            case 0:
                if (scrollRatio <= 0.22) {
                    objs.messageA.style.opacity = calValues(values.messageA_opacity_in, currentYOffset
                        );
                    objs.messageA.style.transform = `translateY(${calValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else {
                    objs.messageA.style.opacity = calValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;

        }

    }

    //스크롤시 현재 스크롤 값에 따라 섹션을 정해주고 보이는 아이디를 바꿔줌
    function scrollLoop() {
        enterNweScene = false;
        prevScrollHeight = 0;

        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            if (currentScene !== 3) {
                enterNweScene = true;
                currentScene++;
                document
                    .body
                    .setAttribute('id', `show-scene-${currentScene}`);
            }
        }

        if (yOffset < prevScrollHeight) {
            if (currentScene !== 0) {
                enterNweScene = true;
                currentScene--;
                document
                    .body
                    .setAttribute('id', `show-scene-${currentScene}`);
            }
        }

        // let totalScrollHeight = 0; for(let i = 0 ; i < sceneInfo.length ; i++){
        // totalScrollHeight += sceneInfo[i].scrollHeight;     if (totalScrollHeight >=
        // yOffset) {         currentScene = i;         break;     } }
        // document.body.setAttribute('id',`show-scene-${currentScene}`);
        // if(enterNweScene == true){     return }

        if (enterNweScene == false) {
            playAnimation();
        }
    }

    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    setLayout();
})();