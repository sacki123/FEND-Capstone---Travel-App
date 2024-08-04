import{ countdownDay } from '../client/js/countdowDays';
it("Test countdownDay Function",()=>{
    const departingDay = new Date();
    departingDay.setDate((departingDay.getDate())+5);
    const result = countdownDay(departingDay);
    expect(result).toBe(5);
});

it("Test countdownDay Function with a past date",()=>{
    const departingDay = new Date();
    departingDay.setDate((departingDay.getDate())-5);
    const result = countdownDay(departingDay);
    expect(result).toBe(-5);
})