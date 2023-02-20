import { Body, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertEvent } from '../../entity/alert-event/alert-event.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class AlertEventService extends BaseEntityService {
    constructor(@InjectRepository(AlertEvent) public entityRepository: Repository<AlertEvent>) {
        super(entityRepository);
    }

    push() {
        return 'Ok';
    }
}
