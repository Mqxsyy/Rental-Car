const rentalPrice = require("../src/rentalPrice");

describe("rentalPrice", () => {
  const {
    canRent,
    getDays,
    getSeason,
    calculateBaseRentPrice,
    getRacerMultiplier,
    getSeasonMultiplier,
    getRentDrationMultiplier,
    getLicenseOwnedDurationMultipler,
    getLicenseOwnedDurationAddition,
    getPrice,
    isWeekend,
  } = rentalPrice;

  test("checks if driver is too young to rent", () => {
    expect(canRent(12)).toBe("Driver too young - cannot quote the price");
  });

  test("checks if driver has not owned license for enough time", () => {
    expect(canRent(20, 0)).toBe("Driver has not held license for enough time");
  });

  test("checks if driver is only able to rent compact car", () => {
    expect(canRent(20, 1, "Racer")).toBe("Driver is too young to rent a Racer");
  });

  test("checks if driver is able to rent a car", () => {
    expect(canRent(23, 1, "Racer")).toBeUndefined();
  });

  test("calculates the number of rental days correctly", () => {
    expect(getDays("2024-06-01", "2024-06-10")).toBe(10);
  });

  test("identifies high season", () => {
    expect(getSeason("2024-06-01", "2024-06-10")).toBe("High");
    expect(getSeason("2024-02-01", "2024-11-01")).toBe("High");
  });

  test("identifies low season", () => {
    expect(getSeason("2024-11-01", "2024-11-10")).toBe("Low");
  });

  test("calculates base rent price without weekends", () => {
    expect(calculateBaseRentPrice(25, 5, "2024-12-30")).toBe(125);
  });

  test("calculates base rent price with weekends", () => {
    expect(calculateBaseRentPrice(25, 5, "2025-01-01")).toBe(127.5);
  });

  test("applies racer multiplier correctly", () => {
    expect(getRacerMultiplier("Racer", 24, "High")).toBe(1.5);
    expect(getRacerMultiplier("Sedan", 24, "High")).toBe(1);
  });

  test("applies season multiplier correctly", () => {
    expect(getSeasonMultiplier("High")).toBe(1.15);
    expect(getSeasonMultiplier("Low")).toBe(1);
  });

  test("applies rent duration multiplier correctly", () => {
    expect(getRentDrationMultiplier(11, "Low")).toBe(0.9);
    expect(getRentDrationMultiplier(5, "High")).toBe(1);
  });

  test("applies license ownership multiplier correctly", () => {
    expect(getLicenseOwnedDurationMultipler(1)).toBe(1.3);
    expect(getLicenseOwnedDurationMultipler(3)).toBe(1);
  });

  test("applies license ownership addition correctly", () => {
    expect(getLicenseOwnedDurationAddition(2, "High", 5)).toBe(75);
    expect(getLicenseOwnedDurationAddition(3, "Low", 5)).toBe(0);
  });

  test("returns message when driver is too young", () => {
    expect(getPrice("2024-06-01", "2024-06-10", "Sedan", 16, 1)).toBe(
      "Driver too young - cannot quote the price",
    );
  });

  test("calculates final price correctly", () => {
    expect(getPrice("2024-06-01", "2024-06-10", "Sedan", 25, 3)).toBe("$293.25");
  });

  test("returns true if weekend", () => {
    expect(isWeekend(0)).toBe(true);
  });

  test("returns false if weekday", () => {
      expect(isWeekend(2)).toBe(false);
  })
});
