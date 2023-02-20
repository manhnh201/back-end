import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConsumerKey } from '../../entity/consumer-key/consumer-key.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';

@Injectable()
export class ConsumerKeyService extends BaseEntityService {
    constructor(@InjectRepository(ConsumerKey) public entityRepository: Repository<ConsumerKey>) {
        super(entityRepository);
    }
}
