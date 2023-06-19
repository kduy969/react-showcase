export function rotateDiv(
  div: HTMLDivElement,
  degs: number,
  durationMS: number
) {
  div.style.transform = `rotate(${degs}deg)`;
  if (durationMS > 0) div.style.transition = `transform ${durationMS}ms linear`;
  else div.style.transition = ``;
}

export function round(n: number) {
  const rounded = Math.round(n * 10) / 10;
  if (rounded === Math.floor(rounded)) {
    return rounded + ".0";
  }
  return rounded + "";
}

export function animLoop(
  render: (frame: number, lastFrame: number) => boolean
) {
  function prepareNextFrame(lastFrame: number) {
    requestAnimationFrame((frame) => {
      const running = render(frame, lastFrame);
      if (running) prepareNextFrame(frame);
    });
  }

  prepareNextFrame(new Date().getTime());
}

export function getRanks(laps: Array<{ startTime: Date, endTime: Date | undefined | null }>) {
  return laps
    // add duration
    .map((l, i) => ({
      ...l, pos: i, duration: (l.endTime || new Date())
        .getTime() - l.startTime.getTime()
    }))
    // sort by duration
    .sort(
      (a, b) =>
        a.duration > b.duration ? -1 : 1
    )
    // add rank base on current index
    .map((l, i) => ({...l, rank: i}))
    // sort the list to original order
    .sort((a, b) => a.pos - b.pos)
    // get list of rank
    .map(l => l.rank);
}

export const LapColors = [
  "#00FFFF",
  "#39FF14",
  "#FF69B4",
  "#FFFF00",
  "#BF00FF",
  "#FFA500",
  "#FF0033","#00FFFF",
  "#39FF14",
  "#FF69B4",
  "#FFFF00",
  "#BF00FF",
  "#FFA500",
  "#FF0033","#00FFFF",
  "#39FF14",
  "#FF69B4",
  "#FFFF00",
  "#BF00FF",
  "#FFA500",
  "#FF0033","#00FFFF",
  "#39FF14",
  "#FF69B4",
  "#FFFF00",
  "#BF00FF",
  "#FFA500",
  "#FF0033","#00FFFF",
  "#39FF14",
  "#FF69B4",
  "#FFFF00",
  "#BF00FF",
  "#FFA500",
  "#FF0033",
];
