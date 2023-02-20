import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IntegrationHist } from '../../entity/integration-hist/integration-hist.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class IntegrationHistService extends BaseEntityService {
    constructor(@InjectRepository(IntegrationHist) public entityRepository: Repository<IntegrationHist>) {
        super(entityRepository);
    }
}
