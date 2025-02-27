import 'colors';
export declare const severityValues: {
    debug: number;
    info: number;
    warning: number;
    error: number;
    special: number;
};
export type logLevel = keyof typeof severityValues;
export declare function severityToColor(severity: logLevel, text: string): string;
export type Logger = Record<logLevel, (...args: string[]) => void>;
export interface config {
    logLevel?: logLevel;
    logColors?: boolean;
}
export declare function factory(config?: config, logSystem?: string, logComponent?: string): Logger;
