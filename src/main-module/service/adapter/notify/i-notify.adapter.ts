import { GeneralResponse } from "src/common-module/dto/general-response.dto";

export interface INotifyAdapter {
    sendNotify(params: ISendNotifyParams): Promise<GeneralResponse>
}

export interface ISendNotifyParams {
    sendTo: string | string[]
    contentText?: string
    contentHtml: string
}