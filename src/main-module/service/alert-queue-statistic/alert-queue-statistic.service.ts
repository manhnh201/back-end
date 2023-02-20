import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertQueueStatistic } from '../../entity/alert-queue-statistic/alert-queue-statistic.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class AlertQueueStatisticService extends BaseEntityService {
    constructor(@InjectRepository(AlertQueueStatistic) public entityRepository: Repository<AlertQueueStatistic>) {
        super(entityRepository);
    }
}
