//test file
const appData = require("./appData");

let data = [
  {
    _id: "6213d4e34cd7cf0372f1a0c9",
    fast: 183,
    slow: 182,
    average: 182,
    blockNum: 14250934,
    lastUpdatedAt: 1645466851,
  },
  {
    _id: "6213d4e94cd7cf0372f1a0ca",
    fast: 183,
    slow: 182,
    average: 182,
    blockNum: 14250934,
    lastUpdatedAt: 1645466857,
  },
];
describe("average function test", () => {
  test("given a data object it should return the average", () => {
    expect(appData.average(data)).toBe(182);
  });
});

describe("store gas data function test", () => {
  test("from time or to time missing", async () => {
    try {
      const res = await appData.getGasAverage(1645466851);
    } catch (error) {
      expect(error.message).toBe("Expected arguments not found");
    }
  });
  test("to time is before from time", async () => {
    try {
      const res = await appData.getGasAverage(1645466862, 1645466851);
    } catch (error) {
      expect(error.message).toBe("from time cannot be after to time");
    }
  });
  test("to time does not exist in DB", async () => {
    try {
      const res = await appData.getGasAverage(1645466851, 1645466853);
    } catch (error) {
      expect(error.message).toBe(
        "No data found from :1645466851 to :1645466853"
      );
    }
  });
  test("from time does not exist in DB", async () => {
    try {
      const res = await appData.getGasAverage(1645466863, 1645466867);
    } catch (error) {
      expect(error.message).toBe(
        "No data found from :1645466863 to :1645466867"
      );
    }
  });
  test("No data found between from time and to time", async () => {
    try {
      const res = await appData.getGasAverage(1645466863, 1645466869); // check if dates provided exist, throw user dates are not found
    } catch (error) {
      expect(error.message).toBe(
        "No data found from :1645466863 to :1645466869"
      );
    }
  });
});
