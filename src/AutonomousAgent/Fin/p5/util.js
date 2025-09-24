function positivizeAngle(angle) {
  let positivizeAngle = angle;
  positivizeAngle = positivizeAngle % (2 * Math.PI);
  if (positivizeAngle < 0) positivizeAngle += 2 * Math.PI;
  return positivizeAngle;
}

function angleDiff(a, b) {
  const diff = Math.abs(a - b) % (2 * Math.PI);
  return diff > Math.PI ? 2 * Math.PI - diff : diff;
}
