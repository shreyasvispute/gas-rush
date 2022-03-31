//timeout function for API polling
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
//average function to calculate the average gas price between to time and from time
function average(data) {
  const averageETHPrices = data
    .filter((j) => j.average > 0)
    .map((i) => i.average);
  return averageETHPrices.reduce((a, v) => a + v) / averageETHPrices.length;
}

module.exports = { delay, average };
