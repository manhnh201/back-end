export class GeneralResponse {
    code: ResponseCode | 0 | -1 = ResponseCode.SUCCESS;
    transactionTime = new Date().getTime();

    errorCode?: string;
    category?: string;
    subCategory?: string;
    message?: string;
    messageDetail?: string;

    value?: any;
}

export enum ResponseCode {
    SUCCESS = 0,
    ERROR = -1,
}