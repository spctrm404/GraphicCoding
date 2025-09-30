function positivizeAngle(angle) {
  let positivizeAngle = angle;
  positivizeAngle = positivizeAngle % (2 * Math.PI);
  if (positivizeAngle < 0) positivizeAngle += 2 * Math.PI;
  return positivizeAngle;
}
