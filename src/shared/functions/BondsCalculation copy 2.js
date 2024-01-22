"use strict";
// Object.defineProperty(exports, "__esModule", { value: true });
//Add this at the beginning of your TypeScript file
// var xlsx = require("xlsx");
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var NCPI_index;
// Function to read Excel file and return the data
var readExcelFile = function (file) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var _a;
            try {
                var data = xlsx.read((_a = event === null || event === void 0 ? void 0 : event.target) === null || _a === void 0 ? void 0 : _a.result, { type: 'binary' });
                var sheetName = data.SheetNames[0]; // Assuming the data is in the first sheet
                var sheet = data.Sheets[sheetName];
                var jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
                resolve(jsonData);
            }
            catch (error) {
                reject(error);
            }
        };
        reader.readAsBinaryString(file);
    });
};
// Add this to the existing code where you want to handle the file upload
var fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', function (event) {
    return __awaiter(void 0, void 0, void 0, function () {
        var files, file, NCPI_index_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = event.target.files;
                    if (!(files && files.length > 0)) return [3 /*break*/, 4];
                    file = files[0];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, readExcelFile(file)];
                case 2:
                    NCPI_index_1 = _a.sent();
                    //   NCPI_index =  await readExcelFile(file);
                    console.log(NCPI_index_1);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error reading the Excel file:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
});
var lastDayOfMonth = function (date) {
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return new Date(date.getFullYear(), date.getMonth(), lastDay);
};
var Bond = /** @class */ (function () {
    function Bond(couponRate, maturityDate, frequency, bookCloseDays) {
        this.couponRate = couponRate;
        this.maturityDate = maturityDate;
        this.frequency = frequency;
        this.bookCloseDays = bookCloseDays;
    }
    Bond.prototype.couppcd = function (settlementDate) {
        var couponInterval = 12 / this.frequency;
        var previousCouponDate = new Date(this.maturityDate);
        while (previousCouponDate > settlementDate) {
            previousCouponDate.setMonth(previousCouponDate.getMonth() - couponInterval);
        }
        return previousCouponDate;
    };
    Bond.prototype.coupncd = function (settlementDate) {
        var couponInterval = 12 / this.frequency;
        var previousCouponDate = new Date(this.maturityDate);
        while (previousCouponDate > settlementDate) {
            previousCouponDate.setMonth(previousCouponDate.getMonth() - couponInterval);
        }
        previousCouponDate.setMonth(previousCouponDate.getMonth() + couponInterval);
        return previousCouponDate;
    };
    Bond.prototype.coupnum = function (settlementDate) {
        var periods = 0;
        var currentDate = new Date(settlementDate);
        while (currentDate < this.maturityDate) {
            currentDate.setMonth(currentDate.getMonth() + 12 / this.frequency);
            periods += 1;
        }
        return periods - 1;
    };
    Bond.prototype.bookClose = function (settlementDate) {
        var nextCouponDate = this.coupncd(settlementDate);
        return new Date(nextCouponDate.getFullYear(), nextCouponDate.getMonth(), nextCouponDate.getDate() - this.bookCloseDays);
    };
    Bond.prototype.price = function (settlementDate, yieldToMaturity) {
        var previousCouponDate = this.couppcd(settlementDate);
        var nextCouponDate = this.coupncd(settlementDate);
        var bookCloseDate = this.bookClose(settlementDate);
        var daysCurrentPeriod = (nextCouponDate.getTime() - previousCouponDate.getTime()) / (1000 * 60 * 60 * 24);
        var daysSettlementToNextCoupon = (nextCouponDate.getTime() - settlementDate.getTime()) / (1000 * 60 * 60 * 24);
        var periodsSettlementToRedemption = this.coupnum(settlementDate);
        var periodsPreviousCouponToRedemption = periodsSettlementToRedemption + daysSettlementToNextCoupon / daysCurrentPeriod;
        if (settlementDate < bookCloseDate &&
            this.maturityDate.getTime() - settlementDate.getTime() > daysCurrentPeriod) {
            var F = periodsSettlementToRedemption;
            var G = periodsPreviousCouponToRedemption;
            var a = yieldToMaturity / this.frequency / 100;
            console.log("Cum A", a);
            var b = Math.pow(1 + a, G);
            console.log("Cum B", b);
            var c = this.couponRate;
            console.log("Cum C", c);
            var d = 100 / b;
            console.log("Cum D", d);
            var e = c / this.frequency / 100;
            console.log("Cum B", b);
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
            console.log("Cum A", a);

            var b = Math.pow(1 + a, G);
            console.log("Cum B", b);

            var c = this.couponRate;
            console.log("Cum C", c);

            var d = 100 / b;
            console.log("Cum D", d);

            var e = c / this.frequency / 100;
            console.log("Cum E", e);

            var g = e / (b * a);
            console.log("Cum G", g);

            var h = (Math.pow(1 + a, F) - 1) * 100;
            console.log("Cum H", h);

            var p = d + g * h;
            console.log("Cum P", p);


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
    return Bond;
}());
// Function to format Date as a string for use as a key
var formatDateKey = function (date) {
    return "".concat(date.getFullYear(), "-").concat(date.getMonth() + 1, "-").concat(date.getDate());
};
var InflationLinkedBond = /** @class */ (function (_super) {
    __extends(InflationLinkedBond, _super);
    function InflationLinkedBond(couponRate, maturityDate, frequency, bookCloseDays, baseIndex) {
        var _this = _super.call(this, couponRate, maturityDate, frequency, bookCloseDays) || this;
        _this.baseIndex = baseIndex;
        return _this;
    }
    InflationLinkedBond.prototype.inflationAdjustedPrice = function (settlementDate, yieldToMaturity, NCPIIndex) {
        var unadjustedPrice = this.price(settlementDate, yieldToMaturity);

        var threeMonthsAgo = new Date(settlementDate);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        var EOMThreeMonthsAgo = lastDayOfMonth(threeMonthsAgo);
        var formattedThreeMonthsAgoDate = formatDateKey(EOMThreeMonthsAgo);
        var NCPIThreeMonthsAgo = NCPIIndex[formattedThreeMonthsAgoDate];

        var fourMonthsAgo = new Date(settlementDate);
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 4);
        var EOMFourMonthsAgo = lastDayOfMonth(fourMonthsAgo);
        var formattedFourMonthsAgoDate = formatDateKey(EOMFourMonthsAgo);
        var NCPIFourMonthsAgo = NCPIIndex[formattedFourMonthsAgoDate];

        var dayOfMonth = settlementDate.getDate();
        var daysInMonth = new Date(settlementDate.getFullYear(), settlementDate.getMonth() + 1, 0).getDate();
        var referenceCPI = NCPIFourMonthsAgo + ((dayOfMonth - 1) / daysInMonth) * (NCPIThreeMonthsAgo - NCPIFourMonthsAgo);
        var indexRatio = referenceCPI / this.baseIndex;
        return Math.round(unadjustedPrice * indexRatio * 100000) / 100000;
    };
    return InflationLinkedBond;
}(Bond));
// Bond Static Data
var GC23 = new Bond(8.85, new Date(2023, 9, 15), 2, 31); // Matured
var GC24 = new Bond(10.5, new Date(2024, 9, 15), 2, 31); // Maturing next year 
var GC25 = new Bond(8.5, new Date(2025, 3, 15), 2, 31);  
var GC26 = new Bond(8.5, new Date(2026, 3, 15), 2, 31);
var GC27 = new Bond(8.0, new Date(2027, 0, 15), 2, 31);
var GC28 = new Bond(8.5, new Date(2028, 9, 15), 2, 31);
var GC30 = new Bond(8.0, new Date(2030, 0, 15), 2, 31);
var GC32 = new Bond(9.0, new Date(2032, 4, 15), 2, 31);
var GC35 = new Bond(9.5, new Date(2035, 6, 15), 2, 31);
var GC37 = new Bond(9.5, new Date(2037, 6, 15), 2, 31);
var GC40 = new Bond(9.8, new Date(2040, 9, 15), 2, 31);
var GC43 = new Bond(10.0, new Date(2043, 6, 15), 2, 31);
var GC45 = new Bond(9.85, new Date(2045, 6, 15), 2, 31);
var GC48 = new Bond(10.0, new Date(2048, 9, 15), 2, 31);
var GC50 = new Bond(10.25, new Date(2050, 6, 15), 2, 31);
// Inflation Linked Static Data
var GI25 = new InflationLinkedBond(3.8, new Date(2025, 7, 15), 2, 31, 111.819909583916);
var GI27 = new InflationLinkedBond(4.0, new Date(2027, 9, 15), 2, 31, 143.70987);
var GI29 = new InflationLinkedBond(4.5, new Date(2029, 0, 15), 2, 31, 126.285551233707);
var GI33 = new InflationLinkedBond(4.5, new Date(2033, 3, 15), 2, 31, 130.86294496974);
var GI36 = new InflationLinkedBond(4.8, new Date(2036, 6, 15), 2, 31, 136.729232775951);
// Tests

var settlementDate = new Date(2023, 5, 20);

// Bond Prices
GC23.price(settlementDate, 8.568);
GC30.price(settlementDate, 10.830);
GC48.price(settlementDate, 13.30025);
GC50.price(settlementDate, 13.352);
// ILB No Adjustment
GI25.price(settlementDate, 3.20);
GI27.price(settlementDate, 3.97);
GI29.price(settlementDate, 5.09);
GI33.price(settlementDate, 6.071);
GI36.price(settlementDate, 6.369);


// ILB Adjusted Prices
if (NCPI_index) {
    GI25.inflationAdjustedPrice(settlementDate, 3.25, NCPI_index);
    console.log("GI25", GI25);
    GI27.inflationAdjustedPrice(settlementDate, 3.97, NCPI_index);
    GI29.inflationAdjustedPrice(settlementDate, 5.09, NCPI_index);
    GI33.inflationAdjustedPrice(settlementDate, 6.071, NCPI_index);
    GI36.inflationAdjustedPrice(settlementDate, 6.369, NCPI_index);
}

// Bond Prices
// console.log("Bond Prices Start Here");
// console.log('GC23 Price:', GC23.price(settlementDate, 8.568));
// console.log('GC30 Price:', GC30.price(settlementDate, 10.830));
console.log('GC32', GC32.price(settlementDate, 10.5));
// console.log('GC48 Price:', GC48.price(settlementDate, 13.30025));
// console.log('GC50 Price:', GC50.price(settlementDate, 13.352));
// console.log("Bond Prices End Here");

// ILB No Adjustment
// console.log("ILB No Adjustment Prices Start Here");
// console.log('GI25 Price:', GI25.price(settlementDate, 3.25));
// console.log('GI27 Price:', GI27.price(settlementDate, 3.97));
// console.log('GI29 Price:', GI29.price(settlementDate, 5.09));
// console.log('GI33 Price:', GI33.price(settlementDate, 6.071));
// console.log('GI36 Price:', GI36.price(settlementDate, 6.369));
// console.log("ILB No Adjustment Prices End Here");

// ILB Adjusted Prices
if (NCPI_index) {
    console.log('GI25 Inflation Adjusted Price:', GI25.inflationAdjustedPrice(settlementDate, 3.25, NCPI_index));
    console.log('GI27 Inflation Adjusted Price:', GI27.inflationAdjustedPrice(settlementDate, 3.97, NCPI_index));
    console.log('GI29 Inflation Adjusted Price:', GI29.inflationAdjustedPrice(settlementDate, 5.09, NCPI_index));
    console.log('GI33 Inflation Adjusted Price:', GI33.inflationAdjustedPrice(settlementDate, 6.071, NCPI_index));
    console.log('GI36 Inflation Adjusted Price:', GI36.inflationAdjustedPrice(settlementDate, 6.369, NCPI_index));
}
