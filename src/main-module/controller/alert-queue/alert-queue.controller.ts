import { Controller, Req, Res } from '@nestjs/common';
import { AlertQueueService } from '../../service/alert-queue/alert-queue.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';
import { Get } from '@nestjs/common/decorators';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { Request, Response } from 'express';

@Controller(['/api/v1/alert-queue', '/api/v1/alertQueue'])
export class AlertQueueController extends BaseEntityController {
    constructor(public entityService: AlertQueueService) {
        super(entityService)
    }

    @Get(['/statistic-state-by-day'])
    statisticStateByDay(@Req() req: Request, @Res() res: Response) {
        let generalResponse = new GeneralResponse();
        this.entityService.statisticStateByDay().then((values) => {
            generalResponse.value = values;
            res.send(generalResponse)
        }).catch(e => {
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get(['/statistic-channel-by-day'])
    statisticChannelByDay(@Req() req: Request, @Res() res: Response) {
        let generalResponse = new GeneralResponse();
        this.entityService.statisticChannelByDay().then((values) => {
            generalResponse.value = values;
            res.send(generalResponse)
        }).catch(e => {
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get(['/statistic-consumer-by-day'])
    statisticConsumerByDay(@Req() req: Request, @Res() res: Response) {
        let generalResponse = new GeneralResponse();
        this.entityService.statisticConsumerByDay().then((values) => {
            generalResponse.value = values;
            res.send(generalResponse)
        }).catch(e => {
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }
}
