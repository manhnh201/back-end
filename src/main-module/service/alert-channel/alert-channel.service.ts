import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertChannel } from '../../entity/alert-channel/alert-channel.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class AlertChannelService extends BaseEntityService {
    constructor(@InjectRepository(AlertChannel) public entityRepository: Repository<AlertChannel>) {
        super(entityRepository);
    }
}
