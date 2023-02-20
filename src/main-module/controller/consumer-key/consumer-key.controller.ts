import { Controller } from '@nestjs/common';
import { ConsumerKeyService } from '../../service/consumer-key/consumer-key.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller(['/api/v1/consumer-key', '/api/v1/consumerKey'])
export class ConsumerKeyController extends BaseEntityController {
    override __getExcludeKeys: string[] = ['updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy'];
    
    constructor(public entityService: ConsumerKeyService) {
        super(entityService)
    }
}
