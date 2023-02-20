import { Controller } from '@nestjs/common';
import { AlertQueueStatisticService } from '../../service/alert-queue-statistic/alert-queue-statistic.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/alert-queue-statistic')
export class AlertQueueStatisticController extends BaseEntityController {
    constructor(public entityService: AlertQueueStatisticService) {
        super(entityService)
    }
}
