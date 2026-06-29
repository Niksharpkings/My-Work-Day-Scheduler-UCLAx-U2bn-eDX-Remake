const momentPackage = globalThis.moment;

function getCurrentMoment() {
  if (!momentPackage) {
    return null;
  }

  return momentPackage();
}

function formatCurrentDay(now) {
  return now.format("dddd, MMMM D, YYYY");
}

function formatClockTime(now) {
  return now.format("hh:mm:ss:SSS A");
}

globalThis.schedulerMoment = {
  getCurrentMoment,
  formatCurrentDay,
  formatClockTime,
};
