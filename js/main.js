(() => {
    
    let yOffset = 0; //window.pageYOffset 대신 사용
    let prevScrollHeight = 0; //현재 스크롤 보다 높은 값의 섹션들의 높이 합
    let currentScene = 0; //현재 씬

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

    function calValues(values, currentYoffset){

    }
    
    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        switch(currentScene){
            case 0:
                let messageA_opacity_0 = sceneInfo[0].values.messageA_opacity[0];
                let messageA_opacity_1 = sceneInfo[0].values.messageA_opacity[1];
                calValues(values.messageA_opacity, objs);
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
        prevScrollHeight = 0;

        for(let i = 0 ; i<currentScene;i++){
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        
        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
            if(currentScene !== 3){
                currentScene++;
                document.body.setAttribute('id',`show-scene-${currentScene}`);
            }
        }
        
        if(yOffset < prevScrollHeight){
            if(currentScene !==0){
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
        playAnimation();
    }

    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);

    window.addEventListener('scroll', () =>{
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    setLayout();
})();