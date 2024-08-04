function countdownDay(departingDay) {
    const departingDaytoDate = new Date(departingDay);
    departingDaytoDate.setHours(0,0,0,0);
    const today = new Date();
    today.setHours(0,0,0,0);
    return (departingDaytoDate - today)/(1000 * 60 * 60 * 24)
}

export {
    countdownDay
}