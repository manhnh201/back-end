import { Controller } from '@nestjs/common';
import { ConsumerService } from '../../service/consumer/consumer.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/consumer')
export class ConsumerController extends BaseEntityController {
    override __getExcludeKeys: string[] = ['updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'];
    
    constructor(public entityService: ConsumerService) {
        super(entityService)
    }
}
