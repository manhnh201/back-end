import * as moment from "moment";

export class DateTimeConvert {
    static parse(data: string, patterns: RegExp[] = [
        /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[ +]{1}\d{2}:\d{2}/g
    ]): Date {
        let __value: Date;
        for (let idx = 0; idx < patterns.length; idx++) {
            let __regex: RegExp = patterns.at(idx)
            if (__regex.test(data)) {
                __value = moment(Date.parse(data)).toDate()
            }
        }
        return __value;
    }
}