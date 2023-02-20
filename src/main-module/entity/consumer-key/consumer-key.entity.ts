import { Entity, Column } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';
import { randomUUID } from 'crypto';

@Entity({ name: 'tbl_consumer_key' })
export class ConsumerKey extends BaseEntity {
    @Column({ name: 'access_key' })
    accessKey: string = randomUUID();;

    @Column({ name: 'consumer_id' })
    consumerId: number;

    @Column({ name: 'expire_time' })
    expireTime: number;

    @Column({ name: 'secret_key' })
    secretKey: number;

    @Column({type: 'json'})
    channels: any;

    @Column()
    enabled: number
}