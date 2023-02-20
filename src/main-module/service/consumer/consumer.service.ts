import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consumer } from '../../entity/consumer/consumer.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class ConsumerService extends BaseEntityService {
    constructor(@InjectRepository(Consumer) public entityRepository: Repository<Consumer>) {
        super(entityRepository);
    }
}
