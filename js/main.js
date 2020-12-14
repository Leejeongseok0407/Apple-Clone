(() => {
  let yOffset = 0; //window.pageYOffset 대신 사용
  let prevScrollHeight = 0; //현재 스크롤 보다 높은 값의 섹션들의 높이 합
  let currentScene = 0; //현재 씬
  let enterNweScene = false; //세로운 신이 시작되는 순간 true
  let acc = 0.1; //가속도 보정치
  let delayYoffset = 0; //딜레이되는 y값
  let rafId; // 애니메이션 ID값
  let rafState; // 애니메이션 상태

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
        canvas: document.querySelector("#video-canvas-0"),
        context: document.querySelector("#video-canvas-0").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
        messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
        messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
        messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
        messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
        messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
        messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
        messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
        messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
        messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
        messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
        messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
        messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
        messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
        messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
        messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
        messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1
      type: "normal",
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        messageA: document.querySelector("#scroll-section-2 .a"),
        messageB: document.querySelector("#scroll-section-2 .b"),
        messageC: document.querySelector("#scroll-section-2 .c"),
        pinB: document.querySelector("#scroll-section-2 .b .pin"),
        pinC: document.querySelector("#scroll-section-2 .c .pin"),
        canvas: document.querySelector("#video-canvas-1"),
        context: document.querySelector("#video-canvas-1").getContext("2d"),
        videoImages: [],
      },
      values: {
        videoImageCount: 960,
        imageSequence: [0, 959],
        canvas_opacity_in: [0, 1, { start: 0, end: 0.1 }],
        canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
        messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
        messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
        messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
        messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
        messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
        messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
        messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
        messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
        messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
        messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
        messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
        pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
        pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector(".canvas-caption"),
        canvas: document.querySelector(".image-blend-canvas"),
        context: document.querySelector(".image-blend-canvas").getContext("2d"),
        imagesPath: ["./images/blend-image-1.jpg", "./images/blend-image-2.jpg"],
        images: [],
      },
      values: {
        //출발값, 최종값으로 구성됨.
        rect1X: [0, 0, { start: 0, end: 0 }],
        rect2X: [0, 0, { start: 0, end: 0 }],
        blendHeight: [0, 0, { start: 0, end: 0 }],
        canvas_scale: [0, 0, { start: 0, end: 0 }],
        canvasCaption_oppacity: [0, 1, { start: 0, end: 0 }],
        canvasCaption_translateY: [10, 0, { start: 0, end: 0 }],
        rectStartY: 0,
      },
    },
  ];

  function setCanvasImages() {
    let imgElem;
    for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
      imgElem = document.createElement("img");
      //imgElem = new Image();
      imgElem.src = `./video/001/IMG_${6726 + i}.jpg`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }

    let imgElem2;
    for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
      imgElem2 = document.createElement("img");
      //imgElem = new Image();
      imgElem2.src = `./video/002/IMG_${7027 + i}.jpg`;
      sceneInfo[2].objs.videoImages.push(imgElem2);
    }

    let imgElem3;
    for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
      imgElem3 = document.createElement("img");
      //imgElem = new Image();
      imgElem3.src = sceneInfo[3].objs.imagesPath[i];
      sceneInfo[3].objs.images.push(imgElem3);
    }
  }

  // 각 스크롤 섹션의 높이를 세팅함
  function setLayout() {
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
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

    document.body.setAttribute("id", `show-scene-${currentScene}`);

    //원래 캠버스 높이 (1080)에 비해 윈도우의 높이를 비율로 계산해줌
    const hightRatio = window.innerHeight / 1080;
    sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${hightRatio})`;
    sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${hightRatio})`;
  }

  //현재 스크롤이 어떤 신의 어느 위치인지 나타내기
  function calcValues(values, currentYoffset) {
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
        returnValues = ((currentYoffset - partScrollStart) / partScrollHight) * (values[1] - values[0]) + values[0];
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
        objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

        if (scrollRatio <= 0.22) {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
          objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
        }
        break;

      //케이스 1은 노멀타입이라서 뺌.
      case 1:
        break;

      case 2:
        if (scrollRatio <= 0.5) {
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
        } else {
          objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
        }

        if (scrollRatio <= 0.32) {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
        } else {
          objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
          objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
        }

        if (scrollRatio <= 0.67) {
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        } else {
          objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
          objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
          objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
        }

        if (scrollRatio <= 0.93) {
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        } else {
          objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
          objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
          objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
        }

        //3번 캔버스 그리기
        if (scrollRatio > 0.9) {
          const objs = sceneInfo[3].objs;
          const values = sceneInfo[3].values;
          const wdithRatio = window.innerWidth / objs.canvas.width;
          const heightRatio = window.innerHeight / objs.canvas.height;
          let canvasScaleRatio;

          if (wdithRatio <= heightRatio) {
            canvasScaleRatio = heightRatio;
          } else {
            canvasScaleRatio = wdithRatio;
          }

          const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
          const whiteRectWidth = recalculatedInnerWidth * 0.15;

          objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
          objs.context.drawImage(objs.images[0], 0, 0);
          objs.context.fillStyle = "white";

          values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
          values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
          values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
          values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

          objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);

          objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
        }

        break;

      //캔버스에 이미지를 넣고 양쪽에 블럭을 채워서 이미지가 커져 보이는 효과를 줌.
      case 3:
        const wdithRatio = window.innerWidth / objs.canvas.width;
        const heightRatio = window.innerHeight / objs.canvas.height;
        let canvasScaleRatio;

        if (wdithRatio <= heightRatio) {
          canvasScaleRatio = heightRatio;
        } else {
          canvasScaleRatio = wdithRatio;
        }
        const canvasHeightSizeDifference = (objs.canvas.height * (1 - canvasScaleRatio)) / 2;
        const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
        const whiteRectWidth = recalculatedInnerWidth * 0.15;

        objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
        objs.context.drawImage(objs.images[0], 0, 0);
        objs.context.fillStyle = "white";

        if (values.rectStartY === 0) {
          values.rectStartY = objs.canvas.offsetTop + canvasHeightSizeDifference;

          values.rect1X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect2X[2].start = window.innerHeight / 2 / scrollHeight;
          values.rect1X[2].end = values.rectStartY / scrollHeight;
          values.rect2X[2].end = values.rectStartY / scrollHeight;
        }

        values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
        values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
        values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
        values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

        objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);

        objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);

        if (scrollRatio < values.rect1X[2].end) {
          objs.canvas.classList.remove(`sticky`);
        } else {
          values.blendHeight[0] = 0;
          values.blendHeight[1] = objs.canvas.height;
          values.blendHeight[2].start = values.rect1X[2].end;
          values.blendHeight[2].end = values.blendHeight[2].start + 0.2;
          const blendHeight = calcValues(values.blendHeight, currentYOffset);

          objs.context.drawImage(objs.images[1], 0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight, 0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight);

          objs.canvas.classList.add(`sticky`);
          objs.canvas.style.top = `${-canvasHeightSizeDifference}px`;

          if (scrollRatio > values.blendHeight[2].end) {
            values.canvas_scale[0] = canvasScaleRatio;
            values.canvas_scale[1] = document.body.offsetWidth / (objs.canvas.width * 1.5);
            values.canvas_scale[2].start = values.blendHeight[2].end;
            values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2;
            objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
            objs.canvas.style.marginTop = `${0}px`;
            objs.canvasCaption.style.opacity = 0;
          }

          if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
            objs.canvas.classList.remove(`sticky`);
            objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`;
            values.canvasCaption_oppacity[2].start = values.canvas_scale[2].end;
            values.canvasCaption_oppacity[2].end = values.canvasCaption_oppacity[2].start + 0.1;
            values.canvasCaption_translateY[2].start = values.canvasCaption_oppacity[2].start;
            values.canvasCaption_translateY[2].end = values.canvasCaption_oppacity[2].end;
            objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_oppacity, currentYOffset);
            objs.canvasCaption.style.transform = `translate3d(0,${calcValues(values.canvasCaption_translateY, currentYOffset)}%,0)`;
          }
        }
        break;
    }
  }

  function checkMenu() {
    if (yOffset > 44) {
      document.body.classList.add("local-nav-sticky");
    } else {
      document.body.classList.remove("local-nav-sticky");
    }
  }

  //스크롤시 현재 스크롤 값에 따라 섹션을 정해주고 보이는 아이디를 바꿔줌
  function scrollLoop() {
    enterNweScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (delayYoffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      if (currentScene !== 3) {
        enterNweScene = true;
        currentScene++;
        document.body.setAttribute("id", `show-scene-${currentScene}`);
      }
    }

    if (delayYoffset < prevScrollHeight) {
      if (currentScene !== 0) {
        enterNweScene = true;
        currentScene--;
        document.body.setAttribute("id", `show-scene-${currentScene}`);
      }
    }

    if (enterNweScene == false) {
      playAnimation();
    }
  }

  function loop() {
    delayYoffset = delayYoffset + (yOffset - delayYoffset) * acc;

    if (!enterNweScene) {
      if (currentScene === 0 || currentScene === 2) {
        const currentYOffset = delayYoffset - prevScrollHeight; //현재 신의 스크롤 위치를 저장함(크기)
        const values = sceneInfo[currentScene].values;
        const objs = sceneInfo[currentScene].objs;
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        if (objs.videoImages[sequence]) objs.context.drawImage(objs.videoImages[sequence], 0, 0);
      }
    }
    rafId = requestAnimationFrame(loop);

    if (Math.abs(yOffset - delayYoffset) < 1) {
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }

  
  
  
  function loadedAddEventListener(){
    window.addEventListener("scroll", () => {
      yOffset = window.pageYOffset;
      scrollLoop();
      checkMenu();
      if (!rafState) {
        rafId = requestAnimationFrame(loop);
        rafState = true;
      }
    });
    
    window.addEventListener("resize", () => {
      if (window.innerHeight > 600) setLayout();
      sceneInfo[3].values.rectStartY = 0;
    });
    
    window.addEventListener("orientationchange", setLayout);
    
    document.querySelector(".loading").addEventListener("transitioned", (e) => {
      document.body.removeChild(e.currentTarget);
    });
  }
  
  
  window.addEventListener("load", () => {
    document.body.classList.remove("before-loading");
    setLayout();
    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
    loadedAddEventListener()
  });
  
  
  setCanvasImages();
  setLayout();
})();
