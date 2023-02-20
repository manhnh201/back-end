import { Controller } from '@nestjs/common';
import { AlertChannelService } from '../../service/alert-channel/alert-channel.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller(['/api/v1/alert-channel', '/api/v1/alertChannel'])
export class AlertChannelController extends BaseEntityController {
    override __getExcludeKeys: string[] = ['updatedBy', 'updatedAt', 'deletedAt', 'deletedBy']

    constructor(public entityService: AlertChannelService) {
        super(entityService)
    }
}
