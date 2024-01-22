var StaticBond = /** @class */ (function () {
    function StaticBond(couponRate, maturityDate, frequency, bookCloseDays) {
        this.couponRate = couponRate;
        this.maturityDate = maturityDate;
        this.frequency = frequency;
        this.bookCloseDays = bookCloseDays;
    }
    StaticBond.prototype.getPreviousCouponDate = function (tradeDate) {
        var couponInterval = 12 / this.frequency;
        var previousCouponDate = new Date(this.maturityDate);
        while (previousCouponDate > tradeDate) {
            previousCouponDate.setMonth(previousCouponDate.getMonth() - couponInterval);
        }
        return previousCouponDate;
    };
    StaticBond.prototype.getNextCouponDate = function (tradeDate) {
        var couponInterval = 12 / this.frequency;
        var previousCouponDate = new Date(this.maturityDate);
        while (previousCouponDate > tradeDate) {
            previousCouponDate.setMonth(previousCouponDate.getMonth() - couponInterval);
        }
        previousCouponDate.setMonth(previousCouponDate.getMonth() + couponInterval);
        return previousCouponDate;
    };
    StaticBond.prototype.getNumberOfCompletedCoupons = function (tradeDate) {
        var periods = 0;
        var currentDate = new Date(tradeDate);
        while (currentDate < this.maturityDate) {
            currentDate.setMonth(currentDate.getMonth() + 12 / this.frequency);
            periods += 1;
        }
        return periods - 1;
    };
    StaticBond.prototype.getBookClose = function (tradeDate) {
        var nextCouponDate = this.getNextCouponDate(tradeDate);
        return new Date(nextCouponDate.getFullYear(), nextCouponDate.getMonth(), nextCouponDate.getDate() - this.bookCloseDays);
    };
    StaticBond.prototype.price = function (settlementDate, yieldToMaturity) {
        var previousCouponDate = this.getPreviousCouponDate(settlementDate);
        var nextCouponDate = this.getNextCouponDate(settlementDate);
        var bookCloseDate = this.getBookClose(settlementDate);
        var daysCurrentPeriod = (nextCouponDate.getTime() - previousCouponDate.getTime()) / (1000 * 60 * 60 * 24);
        var daysSettlementToNextCoupon = (nextCouponDate.getTime() - settlementDate.getTime()) / (1000 * 60 * 60 * 24);
        var periodsSettlementToRedemption = this.getNumberOfCompletedCoupons(settlementDate);
        var periodsPreviousCouponToRedemption = periodsSettlementToRedemption + daysSettlementToNextCoupon / daysCurrentPeriod;
        if (settlementDate < bookCloseDate &&
            this.maturityDate.getTime() - settlementDate.getTime() > daysCurrentPeriod) {
            var F = periodsSettlementToRedemption;
            var G = periodsPreviousCouponToRedemption;
            var a = yieldToMaturity / this.frequency / 100;
            var b = Math.pow(1 + a, G);
            var c = this.couponRate;
            var d = 100 / b;
            var e = c / this.frequency / 100;
            var g = e / (b * a);
            var h = (Math.pow(1 + a, F + 1) - 1) * 100;
            var p = d + g * h;
            return Math.round(p * 100000) / 100000;
        }
        else if (settlementDate > bookCloseDate &&
            this.maturityDate.getTime() - settlementDate.getTime() > daysCurrentPeriod) {
            var F = periodsSettlementToRedemption;
            var G = periodsPreviousCouponToRedemption;
            var a = yieldToMaturity / this.frequency / 100;
            var b = Math.pow(1 + a, G);
            var c = this.couponRate;
            var d = 100 / b;
            var e = c / this.frequency / 100;
            var g = e / (b * a);
            var h = (Math.pow(1 + a, F) - 1) * 100;
            var p = d + g * h;
            return Math.round(p * 100000) / 100000;
        }
        else if (settlementDate < bookCloseDate &&
            this.maturityDate.getTime() - settlementDate.getTime() < daysCurrentPeriod) {
            var E = daysSettlementToNextCoupon;
            var c = this.couponRate;
            var a = 100 + c / this.frequency;
            var b = 1 + (E / 365) * (yieldToMaturity / 100);
            var p = a / b;
            return Math.round(p * 100000) / 100000;
        }
        else {
            var E = daysSettlementToNextCoupon;
            var b = 1 + (E / 365) * (yieldToMaturity / 100);
            var p = 100 / b;
            return Math.round(p * 100000) / 100000;
        }
    };
    // Add this function for calculating accrued interest excluding the next coupon
    StaticBond.prototype.calculateAccruedInterestEx = function (tradeDate) {
        var accruedInterestEx = 0; // Placeholder, replace with actual logic
        console.log('Accrued Interest (Ex):', accruedInterestEx);
        return accruedInterestEx;
    };
    // Add this function for calculating accrued interest including the next coupon
    StaticBond.prototype.calculateAccruedInterestCumulative = function (tradeDate) {
        var accruedInterestCumulative = 0; // Placeholder, replace with actual logic
        console.log('Accrued Interest (Cumulative):', accruedInterestCumulative);
        return accruedInterestCumulative;
    };
    // Add this function for calculating clean price excluding accrued interest
    StaticBond.prototype.calculateCleanPriceEx = function (tradeDate, yieldToMaturity) {
        var accruedInterestEx = this.calculateAccruedInterestEx(tradeDate);
        var cleanPriceEx = this.price(tradeDate, yieldToMaturity) - accruedInterestEx;
        return Math.round(cleanPriceEx * 100000) / 100000;
    };
    // Add this function for calculating clean price including accrued interest
    StaticBond.prototype.calculateCleanPriceCumulative = function (tradeDate, yieldToMaturity) {
        var accruedInterestCumulative = this.calculateAccruedInterestCumulative(tradeDate);
        var cleanPriceCumulative = this.price(tradeDate, yieldToMaturity) - accruedInterestCumulative;
        return Math.round(cleanPriceCumulative * 100000) / 100000;
    };
    return StaticBond;
}());
// Bond Static Data (unchanged)
var tradeDate = new Date(2023, 12, 7);
// Create an instance of StaticBond
var GC32 = new StaticBond(9.0, new Date(2032, 3, 15), 2, 31);

// Calculate accrued interest excluding the next coupon
var accruedInterestEx = GC32.calculateAccruedInterestEx(tradeDate);
console.log('Accrued Interest (Ex):', accruedInterestEx);

// Calculate accrued interest including the next coupon
var accruedInterestCumulative = GC32.calculateAccruedInterestCumulative(tradeDate);
console.log('Accrued Interest (Cumulative):', accruedInterestCumulative);

// Calculate clean price excluding accrued interest
var cleanPriceEx = GC32.calculateCleanPriceEx(tradeDate, 10.5); // replace with actual YTM
console.log('Clean Price (Ex):', cleanPriceEx);

// Calculate clean price including accrued interest
var cleanPriceCumulative = GC32.calculateCleanPriceCumulative(tradeDate, 10.5); // replace with actual YTM
console.log('Clean Price (Cumulative):', cleanPriceCumulative);
