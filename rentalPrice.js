function getPrice(pickupDate, dropoffDate, type, age) {
    console.log(type)
    const days = getDays(pickupDate, dropoffDate);
    const season = getSeason(pickupDate, dropoffDate);

    if (age < 18) {
        return "Driver too young - cannot quote the price";
    }

    if (age <= 21 && type !== "Compact") {
        return "Drivers 21 y/o or less can only rent Compact vehicles";
    }

    let rentalprice = age * days;

    if (type === "Racer" && age <= 25 && season === "High") {
        rentalprice *= 1.5;
    }

    if (season === "High") {
        rentalprice *= 1.15;
    }

    if (days > 10 && season === "Low") {
        rentalprice *= 0.9;
    }

    return "$" + rentalprice;
}

function getDays(pickupDate, dropoffDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const firstDate = new Date(pickupDate);
    const secondDate = new Date(dropoffDate);

    return Math.round(Math.abs((firstDate - secondDate) / oneDay)) + 1;
}

function getSeason(pickupDate, dropoffDate) {
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);

    const highSeasonStart = 4;
    const highSeasonEnd = 10;

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

exports.getPrice = getPrice;
