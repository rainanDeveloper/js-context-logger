import { describe, it } from "mocha";
import { Logger } from "./logger";
import * as assert from 'node:assert';
import Sinon, * as sinon from "sinon";
import { cliColors } from "./utils/cli-colors";
import { SinonSpy } from "sinon";
import { createWriteStream } from "node:fs";

describe('Logger', () => {
    describe('Logger instance - default stdout', () => {
        const unitTestContextMock = 'Logger Unit Test';
        let loggerInstance: Logger = new Logger(unitTestContextMock);

        const nowMock = new Date();
        let clock = sinon.useFakeTimers({
            now: nowMock,
        });
        clock.restore();
        let processStdoutWriteSpy = sinon.spy(process.stdout, 'write');
        processStdoutWriteSpy.restore();
        let processStdErrWriteSpy = sinon.spy(process.stderr, 'write');
        processStdErrWriteSpy.restore();

        beforeEach(() => {
            clock = sinon.useFakeTimers({
                now: nowMock
            });

            processStdoutWriteSpy = sinon.spy(process.stdout, 'write');
            processStdErrWriteSpy = sinon.spy(process.stderr, 'write');
        });
        afterEach(() => {
            clock.restore();
            processStdoutWriteSpy.restore();
            processStdErrWriteSpy.restore();
        })

        it('Logger instance should be defined and an instance of Logger', () => {
            assert.equal(!loggerInstance, false);
            assert.equal((loggerInstance instanceof Logger), true);
        });

        describe('log', () => {
            it('should log to the stdout the message, building correctly a log', async () => {
                const PIDMessageMock = cliColors.green(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.green(`[LOG]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.green(messageMock)}\n`;
                
                const result = loggerInstance.log(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('error', () => {
            it('should log an error to the stderr, building correctly a log', async () => {
                const PIDMessageMock = cliColors.red(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.red(`[ERROR]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.red(messageMock)}\n`;            
                
                const result = loggerInstance.error(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdErrWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });

            it('should log an error to the stderr with the stack of the error, building correctly a log', async () => {
                const PIDMessageMock = cliColors.red(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.red(`[ERROR]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.red(messageMock)}\n`;            
                
                const errorMock = new Error('Some error occurred!');

                const result = loggerInstance.error(messageMock, errorMock.stack);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdErrWriteSpy.calledTwice);
                assert.ok(processStdErrWriteSpy.calledWithExactly(formattedMessageMock));
                assert.ok(processStdErrWriteSpy.calledWithExactly(`${errorMock.stack}\n`));
            });
        });

        describe('warn', () => {
            it('should log an warning to the stdout the message, building correctly a log', async () => {
                const PIDMessageMock = cliColors.yellow(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.yellow(`[WARN]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.yellow(messageMock)}\n`;            
                
                const result = loggerInstance.warn(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('debug', () => {
            it('should log an debug log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.magentaBright(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.magentaBright(`[DEBUG]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.magentaBright(messageMock)}\n`;            
                
                const result = loggerInstance.debug(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('verbose', () => {
            it('should log an verbose log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.cyanBright(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.cyanBright(`[VERBOSE]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.cyanBright(messageMock)}\n`;            
                
                const result = loggerInstance.verbose(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('fatal', () => {
            it('should log an fatal log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.bold(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.bold(`[FATAL]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.bold(messageMock)}\n`;            
                
                const result = loggerInstance.fatal(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(processStdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });
    });

    describe('Logger instance - file stdout with path', () => {
        const unitTestContextMock = 'Logger Unit Test';
        const filePath = 'test.output';
        process.env.NO_COLOR='true';
        let loggerInstance: Logger = new Logger(unitTestContextMock, filePath);

        const nowMock = new Date();
        let clock = sinon.useFakeTimers({
            now: nowMock,
        });
        clock.restore();
        let stdoutWriteSpy: SinonSpy<[chunk: any, callback?: (error: Error) => void], boolean> = sinon.spy(loggerInstance.stdout, 'write') as any;
        stdoutWriteSpy.restore();

        beforeEach(() => {
            clock = sinon.useFakeTimers({
                now: nowMock
            });

            stdoutWriteSpy = sinon.spy(loggerInstance.stdout, 'write') as any;
        });
        afterEach(() => {
            clock.restore();
            stdoutWriteSpy.restore();
        })

        it('Logger instance should be defined and an instance of Logger', () => {
            assert.equal(!loggerInstance, false);
            assert.equal((loggerInstance instanceof Logger), true);
        });

        describe('log', () => {
            it('should log to the stdout the message, building correctly a log', async () => {
                const PIDMessageMock = cliColors.green(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.green(`[LOG]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.green(messageMock)}\n`;
                
                const result = loggerInstance.log(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('error', () => {
            it('should log an error to the stderr, building correctly a log', async () => {
                const PIDMessageMock = cliColors.red(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.red(`[ERROR]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.red(messageMock)}\n`;            
                
                const result = loggerInstance.error(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });

            it('should log an error to the stderr with the stack of the error, building correctly a log', async () => {
                const PIDMessageMock = cliColors.red(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.red(`[ERROR]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.red(messageMock)}\n`;            
                
                const errorMock = new Error('Some error occurred!');

                const result = loggerInstance.error(messageMock, errorMock.stack);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledTwice);
                assert.ok(stdoutWriteSpy.calledWithExactly(formattedMessageMock));
                assert.ok(stdoutWriteSpy.calledWithExactly(`${errorMock.stack}\n`));
            });
        });

        describe('warn', () => {
            it('should log an warning to the stdout the message, building correctly a log', async () => {
                const PIDMessageMock = cliColors.yellow(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.yellow(`[WARN]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.yellow(messageMock)}\n`;            
                
                const result = loggerInstance.warn(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('debug', () => {
            it('should log an debug log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.magentaBright(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.magentaBright(`[DEBUG]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.magentaBright(messageMock)}\n`;            
                
                const result = loggerInstance.debug(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('verbose', () => {
            it('should log an verbose log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.cyanBright(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.cyanBright(`[VERBOSE]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.cyanBright(messageMock)}\n`;            
                
                const result = loggerInstance.verbose(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('fatal', () => {
            it('should log an fatal log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.bold(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.bold(`[FATAL]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.bold(messageMock)}\n`;            
                
                const result = loggerInstance.fatal(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });
    });

    describe('Logger instance - stdout being a writestream', () => {
        const unitTestContextMock = 'Logger Unit Test';
        const stdoutWritestream = createWriteStream('test.output');
        process.env.NO_COLOR='true';
        let loggerInstance: Logger = new Logger(unitTestContextMock, stdoutWritestream);

        const nowMock = new Date();
        let clock = sinon.useFakeTimers({
            now: nowMock,
        });
        clock.restore();
        let stdoutWriteSpy: SinonSpy<[chunk: any, callback?: (error: Error) => void], boolean> = sinon.spy(loggerInstance.stdout, 'write') as any;
        stdoutWriteSpy.restore();

        beforeEach(() => {
            clock = sinon.useFakeTimers({
                now: nowMock
            });

            stdoutWriteSpy = sinon.spy(loggerInstance.stdout, 'write') as any;
        });
        afterEach(() => {
            clock.restore();
            stdoutWriteSpy.restore();
        })

        it('Logger instance should be defined and an instance of Logger', () => {
            assert.equal(!loggerInstance, false);
            assert.equal((loggerInstance instanceof Logger), true);
        });

        describe('log', () => {
            it('should log to the stdout the message, building correctly a log', async () => {
                const PIDMessageMock = cliColors.green(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.green(`[LOG]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.green(messageMock)}\n`;
                
                const result = loggerInstance.log(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('error', () => {
            it('should log an error to the stderr, building correctly a log', async () => {
                const PIDMessageMock = cliColors.red(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.red(`[ERROR]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.red(messageMock)}\n`;            
                
                const result = loggerInstance.error(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });

            it('should log an error to the stderr with the stack of the error, building correctly a log', async () => {
                const PIDMessageMock = cliColors.red(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.red(`[ERROR]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.red(messageMock)}\n`;            
                
                const errorMock = new Error('Some error occurred!');

                const result = loggerInstance.error(messageMock, errorMock.stack);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledTwice);
                assert.ok(stdoutWriteSpy.calledWithExactly(formattedMessageMock));
                assert.ok(stdoutWriteSpy.calledWithExactly(`${errorMock.stack}\n`));
            });
        });

        describe('warn', () => {
            it('should log an warning to the stdout the message, building correctly a log', async () => {
                const PIDMessageMock = cliColors.yellow(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.yellow(`[WARN]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.yellow(messageMock)}\n`;            
                
                const result = loggerInstance.warn(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('debug', () => {
            it('should log an debug log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.magentaBright(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.magentaBright(`[DEBUG]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.magentaBright(messageMock)}\n`;            
                
                const result = loggerInstance.debug(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('verbose', () => {
            it('should log an verbose log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.cyanBright(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.cyanBright(`[VERBOSE]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.cyanBright(messageMock)}\n`;            
                
                const result = loggerInstance.verbose(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });

        describe('fatal', () => {
            it('should log an fatal log to the stdout, building correctly a log', async () => {
                const PIDMessageMock = cliColors.bold(`pid: [${process.pid}]`);
                const timestampMock = (new Date()).toLocaleString();
                const formattedLogLevelMock = cliColors.bold(`[FATAL]`);
                const contextMessageMock = cliColors.yellow(`[${unitTestContextMock}]`);
                const messageMock = `Some logging message`;

                const formattedMessageMock = 
                    `${PIDMessageMock} - ${timestampMock} ${formattedLogLevelMock} ${contextMessageMock} ${cliColors.bold(messageMock)}\n`;            
                
                const result = loggerInstance.fatal(messageMock);
                
                assert.deepStrictEqual(result, undefined);
                assert.ok(stdoutWriteSpy.calledOnceWithExactly(formattedMessageMock));
            });
        });
    });
})