function canRent(age, licenseOwnedYears, type) {
    if (age < 18) {
        return "Driver too young - cannot quote the price";
    }

    if (licenseOwnedYears < 1) {
        return "Driver has not held license for enough time";
    }

    if (age <= 21 && type !== "Compact") {
        return `Driver is too young to rent a ${type}`;
    }
}

function getDays(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);

    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
    const highSeasonStart = 3;
    const highSeasonEnd = 9;

    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    const pickupMonth = pickup.getMonth();
    const dropoffMonth = dropoff.getMonth();

    if (
        (pickupMonth >= highSeasonStart && pickupMonth <= highSeasonEnd) ||
        (dropoffMonth >= highSeasonStart && dropoffMonth <= highSeasonEnd) ||
        (pickupMonth <= highSeasonStart && dropoffMonth >= highSeasonEnd)
    ) {
        return "High";
    }

    return "Low";
}

function isWeekend(day) {
    return day % 6 === 0
}

function calculateBaseRentPrice(age, days, pickupDate) {
    const day = new Date(pickupDate).getDay();
    let sum = 0

    for (let i = 0; i < days; i++) {
        if (isWeekend(day)) {
            sum += age * 1.05
        }
        else{
            sum += age
        }
        
        day++;
        if (day >= 7) {
            day = 0
        }
    }
     
    return sum;
}

function getRacerMultiplier(type, age, season) {
    if (type === "Racer" && age <= 25 && season === "High") {
        return 1.5;
    }

    return 1;
}

function getSeasonMultiplier(season) {
    return season === "High" ? 1.15 : 1;
}

function getRentDurationMultiplier(days, season) {
    if (days > 10 && season === "Low") {
        return 0.9;
    }

    return 1;
}

function getLicenseOwnedDurationMultipler(licenseOwnedYears) {
    return licenseOwnedYears < 2 ? 1.3 : 1;
}

function getLicenseOwnedDurationAddition(licenseOwnedYears, season, days) {
    if (licenseOwnedYears < 3 && season === "High") {
        return 15 * days;
    }

    return 0;
}

function getPrice(pickupDate, dropoffDate, type, age, licenseOwnedYears) {
    const canRentMessage = canRent(age, licenseOwnedYears, type);
    if (canRentMessage) {
        return canRentMessage;
    }

    const days = getDays(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);

    const basePrice = calculateBaseRentPrice(age, days);

    const multipliers = [
        getRacerMultiplier(type, age, season),
        getSeasonMultiplier(season),
        getRentDurationMultiplier(days, season),
        getLicenseOwnedDurationMultipler(licenseOwnedYears),
    ];

    const multipliedPrice = multipliers.reduce(
        (price, multiplier) => price * multiplier,
        basePrice,
    );

    const addition = getLicenseOwnedDurationAddition(
        licenseOwnedYears,
        season,
        days,
    );

    const addedPrice = multipliedPrice + addition;

    return `$${addedPrice}`;
}

module.exports = {
    canRent,
    getDays,
    getSeason,
    calculateBaseRentPrice,
    getRacerMultiplier,
    getSeasonMultiplier,
    getRentDrationMultiplier: getRentDurationMultiplier,
    getLicenseOwnedDurationMultipler,
    getLicenseOwnedDurationAddition,
    getPrice,
};
