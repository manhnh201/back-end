import { GeneralResponse } from "src/common-module/dto/general-response.dto";
import { INotifyAdapter, ISendNotifyParams } from "./i-notify.adapter";
import * as nodemailer from "nodemailer"
import { Logger } from "@nestjs/common";

export class MailAdapter implements INotifyAdapter {
    private readonly log = new Logger(MailAdapter.name);
    private config: any = {
        host: process.env['mail-server.host'],
        port: parseInt(process.env['mail-server.port']),
        secure: false,
        auth: {
            user: process.env['mail-server.username'],
            pass: process.env['mail-server.password'],
        },
    };

    sendNotify(params: MailNotifyParams): Promise<GeneralResponse> {
        let transporter: nodemailer.Transporter = nodemailer.createTransport(this.config);
        return new Promise((resolve, reject) => {
            transporter.sendMail({
                from: params.sendFrom,
                to: params.sendTo,
                subject: params.subject,
                text: params.contentText,
                html: params.contentHtml,
            }).then(info => {
                this.log.log(`Message sent: ${info.messageId}`);
                this.log.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
                resolve(new GeneralResponse)
            }).catch((e) => {
                reject(e)
            }).finally(() => {
                transporter.close()
            })
        })
    }
}

export class MailNotifyParams implements ISendNotifyParams {
    sendFrom: string;
    sendTo: string | string[]
    subject: string
    contentText?: string
    contentHtml: string
}