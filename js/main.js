(() => {
    
    let yOffset = 0; //window.pageYOffset 대신 사용
    let prevScrollHeight = 0; //현재 스크롤 보다 높은 값의 섹션들의 높이 합
    let currentScene = 0; //현재 씬
    let enterNweScene = false; //세로운 신이 시작되는 순간 true

    const sceneInfo =[
        {
            //0
            type : 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d')
            },
            values:{
                messageA_opacity: [0, 1]
            }
        },
        {
            //1
            type : 'nomal',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            //2
            type : 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            //3
            type : 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];
    

    // 각 스크롤 섹션의 높이를 세팅함
    function setLayout(){
        for(let i = 0; i < sceneInfo.length ; i++){
            sceneInfo[i].scrollHeight = sceneInfo[i].heightNum* window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`
        }

        let totalScrollHeight = 0;

        yOffset = window.pageYOffset;
        for(let i = 0 ; i < sceneInfo.length ; i++){
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }

        document.body.setAttribute('id',`show-scene-${currentScene}`);
        
    }

    //현재 스크롤이 어떤 신의 어느 위치인지 나타내기
    function calValues(values, currentYoffset){
        let returnValues;
        
        //%로 어느 위치인지 나타내기
        let scrollRatio = currentYoffset / sceneInfo[currentScene].scrollHeight;
        
        //범위의 차 곱하고 초기값 더해주면 현재 위치 나옴.
        returnValues = scrollRatio * (values[1]- values[0]) + values[0];
        
        return returnValues;
    }
    
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        switch(currentScene){
            case 0:
                let messageA_opacity_in = calValues(values.messageA_opacity, currentYOffset);
                objs.messageA.style.opacity = messageA_opacity_in;
                console.log(messageA_opacity_in);
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
    function scrollLoop(){
        enterNweScene = false;
        prevScrollHeight = 0;

        for(let i = 0 ; i<currentScene;i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            if(currentScene !== 3){
                enterNweScene = true;
                currentScene++;
                document.body.setAttribute('id',`show-scene-${currentScene}`);
            }
        }
        
        if(yOffset < prevScrollHeight){
            if(currentScene !==0){
                enterNweScene = true;
                currentScene--;
                document.body.setAttribute('id',`show-scene-${currentScene}`);
            }
        }

        // let totalScrollHeight = 0;
        // for(let i = 0 ; i < sceneInfo.length ; i++){
        //     totalScrollHeight += sceneInfo[i].scrollHeight;
        //     if (totalScrollHeight >= yOffset) {
        //         currentScene = i;
        //         break;
        //     }
        // }

        // document.body.setAttribute('id',`show-scene-${currentScene}`);
        
        // if(enterNweScene == true){
        //     return
        // }

        if(enterNweScene == false){
            playAnimation();
        }
    }

    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);

    window.addEventListener('scroll', () =>{
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    setLayout();
})();