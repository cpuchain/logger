import dateFormat from 'dateformat';
import 'colors';

function cap(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const severityValues = {
    debug: 1,
    info: 2,
    warning: 3,
    error: 4,
    special: 5,
};

export type logLevel = keyof typeof severityValues;

export function severityToColor(severity: logLevel, text: string) {
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

export type Logger = Record<logLevel, (...args: string[]) => void>;

export interface config {
    logLevel?: logLevel;
    logColors?: boolean;
}

export function factory(config?: config, logSystem?: string, logComponent?: string) {
    const logColors = typeof config?.logColors !== 'undefined' ? config?.logColors : true;
    const logLevelInt = severityValues[config?.logLevel || 'debug'];

    const log = (
        severity: logLevel,
        system: string,
        component: string | undefined,
        text: string,
        subcat?: string,
    ) => {
        if (severityValues[severity] < logLevelInt) {
            return;
        }

        let entryDesc = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss') + ' [' + system + ']\t';

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
            } else {
                logString += text.grey;
            }
        } else {
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

    return Object.keys(severityValues).reduce((acc, curr) => {
        const logLevel = curr as logLevel;

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
    }, {} as Logger);
}
