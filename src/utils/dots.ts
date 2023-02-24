export interface Point {
  x: number;
  y: number;
  position: "top" | "left" | "bottom";
}

export function distributeDots(
  rectangleSize: { width: number; height: number },
  dotCount: number
): Point[] {
  const points: Point[] = [];

  // Calculate the number of dots that should be placed on each side of the rectangle
  const dotsPerSide = Math.floor((dotCount - 1) / 2);
  const leftOvers = (dotCount - 1) % 2;

  const sideDists = {
    top: rectangleSize.height / (dotsPerSide + 1 + leftOvers),
    bottom: rectangleSize.height / (dotsPerSide + 1),
  };

  points.push({
    x: -5,
    y: rectangleSize.height / 2,
    position: "left",
  });

  // Add points on the top side of the rectangle
  if (sideDists.top !== rectangleSize.width) {
    for (let i = 1; i <= dotsPerSide + leftOvers; i++) {
      points.push({ y: -5, x: i * sideDists.top, position: "top" });
    }
  }

  if (sideDists.bottom !== rectangleSize.width) {
    for (let i = 1; i <= dotsPerSide; i++) {
      points.push({
        y: rectangleSize.height + 5,
        x: i * sideDists.top,
        position: "bottom",
      });
    }
  }

  // If there are any dots left over, add them to the first side

  return points;
}
