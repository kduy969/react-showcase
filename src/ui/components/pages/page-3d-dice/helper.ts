import anime from "animejs/lib/anime.es";

export const Base3DRotate = [
  [0, 0, 0],
  [90, 0, 0],
  [0, 0, -90],
  [0, 0, 90],
  [-90, 0, 0],
  [180, 0, 0],
];

const rollDiceWithBounce = (
  translateBox: HTMLDivElement,
  box: HTMLDivElement
) => {
  // roll dice
  // animate the box in sequence of animations and the ending position should be balanced
  const addBounceToTimeline = (
    tl: anime.AnimeTimelineInstance,
    {
      duration,
      startX,
      startZ,
      endX,
      endZ,
      bounceHeight,
      offset,
      rotation,
      targetSide,
    }: {
      duration: number;
      startX: number;
      startZ: number;
      endX: number;
      endZ: number;
      bounceHeight: number;
      offset: number;
      rotation: number;
      targetSide?: number;
    }
  ) => {
    tl.add(
      // bounce up
      {
        targets: translateBox,
        translateY: -bounceHeight,
        translateX: (startX + endX) / 2,
        translateZ: (startZ + endZ) / 2,
        duration: duration / 2,
      }
    ).add(
      // bounce down
      {
        targets: translateBox,
        translateY: 0,
        translateX: endX,
        translateZ: endZ,
        duration: duration / 2,
      }
    );
    // .add(
    //   // rotating the dice randomly
    //   {
    //     targets: box.current,
    //     rotateX: targetSide
    //       ? Base3DRotate[targetSide - 1][0] +
    //         Math.floor(rotation / 360) * 360
    //       : rotation,
    //     rotateY: targetSide
    //       ? Base3DRotate[targetSide - 1][1] +
    //         Math.floor(rotation / 360) * 360
    //       : rotation,
    //     rotateZ: targetSide
    //       ? Base3DRotate[targetSide - 1][2] +
    //         Math.floor(rotation / 360) * 360
    //       : rotation,
    //     duration,
    //   },
    //   offset
    // );
  };
  //config
  // initial power -> bounceTime , bounceDistance, rotate
  // power will decrease after each bounce until get reducing to a minimum threshold -> final bounce
  let remainingPower = Math.random() * 4 + 6; // 6 - 10
  const powerThreshold = 2;
  const baseBounceDuration = 200;
  const baseX = 30;
  const baseZ = 0;
  const baseRotate = 50;
  const baseBounceHeight = 20;

  let totalDuration = 0;
  let currentX = 0;
  let currentZ = 0;
  let currentRotate = 0;
  // create timeline
  const tl = anime.timeline({
    targets: box,
    duration: 1000, // Can be inherited
    easing: `cubicBezier(.6,.81,.41,.2)`, // Can be inherited
    direction: "normal", // Is not inherited
    loop: false, // Is not inherited
  });

  // create 4 bounce
  // each bounce will contain 2 animation happening at the same time
  //    bounce the dice from the starting point to ending point( starting point of next bounce or ending point)
  //    rotate the dice randomly around itself in 3 directions
  const maxX = 300,
    maxZ = 300;
  while (remainingPower > powerThreshold) {
    const duration = baseBounceDuration * remainingPower;
    const bounceHeight = baseBounceHeight * remainingPower;
    const bounceDistanceX = baseX * remainingPower;
    const bounceDistanceZ = baseZ * remainingPower;
    let bounceDirectX = Math.random() > 0.5 ? 1 : -1;
    let bounceDirectZ = Math.random() > 0.5 ? 1 : -1;
    //check if the direction make dice hitting the area edge
    let endX = currentX + bounceDirectX * bounceDistanceX;
    if (endX < 0 || endX > maxX) {
      bounceDirectX = bounceDirectX * -1;
      endX = currentX + bounceDirectX * bounceDistanceX;
    }
    let endZ = currentX + bounceDirectZ * bounceDistanceZ;
    if (endZ < 0 || endZ > maxZ) {
      bounceDirectZ = bounceDirectZ * -1;
      endZ = currentZ + bounceDirectZ * bounceDistanceZ;
    }

    const isLastBounce = remainingPower * 0.7 < powerThreshold;
    const deltaRotate = baseRotate * remainingPower;
    addBounceToTimeline(tl, {
      duration: duration,
      startX: currentX,
      startZ: currentZ,
      endX: endX,
      endZ: endZ,
      bounceHeight: baseBounceHeight * remainingPower,
      rotation: currentRotate + deltaRotate,
      offset: totalDuration,
      targetSide: isLastBounce ? 4 : undefined,
    });
    currentRotate = currentRotate + deltaRotate;
    currentX = endX;
    currentZ = endZ;
    totalDuration += duration;
    remainingPower = remainingPower * 0.7;
  }
  tl.play();
};

export const rollDice = (
  translateBox: HTMLDivElement,
  box: HTMLDivElement,
  lastConfig: {
    rotateX: number;
    rotateY: number;
    rotateZ: number;
  }
) => {
  const nextNumber = Math.floor(Math.random() * 6) + 1;
  const config = {
    rotateX:
      lastConfig.rotateX -
      (lastConfig.rotateX % 360) +
      Base3DRotate[nextNumber - 1][0] +
      (Math.floor(Math.random() * 2) + 2) * 360,
    rotateY:
      lastConfig.rotateY -
      (lastConfig.rotateY % 360) +
      Base3DRotate[nextNumber - 1][1] +
      (Math.floor(Math.random() * 2) + 2) * 360,
    rotateZ: Base3DRotate[nextNumber - 1][2],
  };
  anime({
    duration: 5000,
    targets: box,
    easing: "cubicBezier(.2,.22,.64,1.09)",
    ...config,
  });

  return config;
};
