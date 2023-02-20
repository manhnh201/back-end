import { Injectable } from '@nestjs/common';

import * as log4js from 'log4js'
import * as dotenv from 'dotenv'
import * as _ from 'lodash'
import { LoggerService, LogLevel } from '@nestjs/common/services';

dotenv.config();

@Injectable()
export class LogProvider implements LoggerService {
    appName = process.env['app.name'];
    logPath = process.env['LOG.PATH'] || '/opt/logs';
    logPattern = process.env['LOG.PATTERN'] || '[%p] %d %h: %m';   //[%p] %d %h %f{2}.%l: %m

    logstashEnabled = process.env['LOG.LOGSTASH.ENABLED'] === 'true' && !_.isUndefined(process.env['LOG.LOGSTASH.URL'])
    logstashUrl = process.env['LOG.LOGSTASH.URL']

    static logger: log4js.Logger

    config = {
        appenders: {
            out: {
                type: "stdout",
                layout: {
                    type: "pattern",
                    pattern: this.logPattern,
                }
            },
            file: {
                type: "dateFile", filename: `${this.logPath}/${this.appName}.log`, compress: true, numBackups: 365,
                layout: {
                    type: "pattern",
                    pattern: this.logPattern,
                }
            },
        },
        categories: {
            default: {
                appenders: [
                    "out",
                    "file",
                ], level: "debug",
                enableCallStack: true,
            }
        },
    };

    constructor() {
        log4js.configure(this.config);
        if (!LogProvider.logger) {
            LogProvider.logger = log4js.getLogger();
            LogProvider.logger.addContext('app_name', this.appName);
        }
    }

    getLogger(): log4js.Logger {
        return LogProvider.logger
    }

    log(message: any, ...optionalParams: any[]) {
        LogProvider.logger.info(message)
    }
    error(message: any, ...optionalParams: any[]) {
        LogProvider.logger.error(message)
    }
    warn(message: any, ...optionalParams: any[]) {
        LogProvider.logger.warn(message)
    }
    debug?(message: any, ...optionalParams: any[]) {
        LogProvider.logger.debug(message)
    }
    verbose?(message: any, ...optionalParams: any[]) {
        throw new Error('Method not implemented.');
    }
    setLogLevels?(levels: LogLevel[]) {
        throw new Error('Method not implemented.');
    }
}
