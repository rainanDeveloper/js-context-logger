import { WriteStream, createWriteStream } from "fs";
import { cliColors } from "./utils/cli-colors";

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

export type StdOut = WriteStream | string;

export class Logger {
    readonly stdout: WriteStream;
    constructor(private readonly context?: string, stdout?: StdOut) {
        if(stdout) {
            if(typeof stdout == 'string') {
                this.stdout = createWriteStream(stdout);
            }
            else {
                this.stdout = stdout;
            }
        }
    }

    private getColorByLogLevel(logLevel: LogLevel) {
        switch (logLevel) {
            case 'debug':
              return cliColors.magentaBright;
            case 'warn':
              return cliColors.yellow;
            case 'error':
              return cliColors.red;
            case 'verbose':
              return cliColors.cyanBright;
            case 'fatal':
              return cliColors.bold;
            default:
              return cliColors.green;
        }
      
    }

    private colorize(message: string, logLevel: LogLevel) {
        const color = this.getColorByLogLevel(logLevel);
        return color(message);
    }

    private formatPID(pid: number, logLevel: LogLevel) {
        return this.colorize(`pid: [${pid}]`, logLevel);
    }

    private formatContext() {
        return cliColors.yellow(`[${this.context}]`)
    }

    private formatLogLevel(logLevel: LogLevel) {
        return this.colorize(`[${logLevel.toUpperCase()}]`, logLevel);
    }

    private formatMessage(message: string, logLevel: LogLevel) {
        const PIDMessage = this.formatPID(process.pid, logLevel);
        const timestamp = this.getCurrentTimestampFormatted();
        const formattedLogLevel = this.formatLogLevel(logLevel);
        const contextMessage = this.formatContext();
        message = this.colorize(message, logLevel);
        return `${PIDMessage} - ${timestamp} ${formattedLogLevel} ${contextMessage} ${message}\n`;
    }

    private getCurrentTimestampFormatted() {
        return new Date().toLocaleString(process.env.LOCALE || 'en-US');
    }

    private printMessage(message: string, logLevel: LogLevel, writeStreamType?: 'stderr' | 'stdout') {
        const finalMessage = this.formatMessage(message, logLevel);

        if(this.stdout) {
            this.stdout.write(finalMessage);
            return;
        }

        process[writeStreamType || 'stdout'].write(finalMessage);
    }

    private printStack(stack: string) {
        const formattedStack = `${stack}\n`;
        if(!stack) return;

        if(this.stdout) {
            this.stdout.write(formattedStack);
            return;
        }

        process.stderr.write(formattedStack);
    }

    public log (message: string) {
        this.printMessage(message, 'log');
    }

    public error(message: string, stack?: string) {
        this.printMessage(message, 'error', 'stderr');
        this.printStack(stack);
    }

    public warn(message: string) {
        this.printMessage(message, 'warn');
    }

    public debug(message: string) {
        this.printMessage(message, 'debug');
    }

    public verbose(message: string) {
        this.printMessage(message, 'verbose');
    }

    public fatal(message: string) {
        this.printMessage(message, 'fatal');
    }
}