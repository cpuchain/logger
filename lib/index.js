"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.severityValues = void 0;
exports.severityToColor = severityToColor;
exports.factory = factory;
const dateformat_1 = __importDefault(require("dateformat"));
require("colors");
function cap(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
exports.severityValues = {
    debug: 1,
    info: 2,
    warning: 3,
    error: 4,
    special: 5,
};
function severityToColor(severity, text) {
    switch (severity) {
        case 'debug':
            return text.green;
        case 'info':
            return text.blue;
        case 'warning':
            return text.yellow;
        case 'error':
            return text.red;
        case 'special':
            return text.cyan.underline;
        default:
            console.log('Unknown severity ' + severity);
            return text.italic;
    }
}
function factory(config, logSystem, logComponent) {
    const logColors = typeof config?.logColors !== 'undefined' ? config?.logColors : true;
    const logLevelInt = exports.severityValues[config?.logLevel || 'debug'];
    const log = (severity, system, component, text, subcat) => {
        if (exports.severityValues[severity] < logLevelInt) {
            return;
        }
        let entryDesc = (0, dateformat_1.default)(new Date(), 'yyyy-mm-dd HH:MM:ss') + ' [' + system + ']\t';
        let logString = '';
        if (logColors) {
            entryDesc = severityToColor(severity, entryDesc);
            logString = entryDesc;
            if (component) {
                logString += ('[' + component + '] ').italic;
            }
            if (subcat) {
                // @ts-expect-error grey not type
                logString += ('(' + subcat + ') ').bold.grey;
            }
            if (!component) {
                logString += text;
            }
            else {
                logString += text.grey;
            }
        }
        else {
            logString = entryDesc;
            if (component) {
                logString += '[' + component + '] ';
            }
            if (subcat) {
                logString += '(' + subcat + ') ';
            }
            logString += text;
        }
        console.log(logString);
    };
    return Object.keys(exports.severityValues).reduce((acc, curr) => {
        const logLevel = curr;
        acc[logLevel] = (...args) => {
            if (!logSystem && args.length === 1) {
                return log(logLevel, cap(logLevel), logComponent, args[0]);
            }
            if (!logSystem && args.length === 2) {
                return log(logLevel, args[0], logComponent, args[1]);
            }
            if (logSystem && args.length === 1) {
                return log(logLevel, logSystem, logComponent, args[0]);
            }
            if (logSystem && args.length === 2) {
                return log(logLevel, logSystem, args[0], args[1]);
            }
            if (args.length === 3) {
                return log(logLevel, args[0], args[1], args[2]);
            }
            return log(logLevel, args[0], args[1], args[2], args[3]);
        };
        return acc;
    }, {});
}
