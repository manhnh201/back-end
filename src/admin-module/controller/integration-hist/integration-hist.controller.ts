import { Controller } from '@nestjs/common';
import { IntegrationHistService } from '../../service/integration-hist/integration-hist.service';
import { BaseEntityController } from 'src/common-module/controller/base-entity/base-entity.controller';

@Controller('/api/v1/integration-hist')
export class IntegrationHistController extends BaseEntityController {
    constructor(public entityService: IntegrationHistService) {
        super(entityService)
    }
}
