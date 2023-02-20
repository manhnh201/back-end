import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AlertEventService } from '../../service/alert-event/alert-event.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller(['/api/v1/alert-event', '/api/v1/alertEvent'])
export class AlertEventController extends BaseEntityController {
    override __getExcludeKeys: string[] = ['updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy']
    constructor(public entityService: AlertEventService) {
        super(entityService)
    }

    @Post('push')
    push() {
        return this.entityService.push();
    }
}
