import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_alert_event' })
export class AlertEvent extends BaseEntity {
    @Column()
    channel: string;

    @Column({ name: 'type' })
    type: string;

    @Column({ name: 'transaction_id' })
    transactionId: string;

    @Column({ name: 'transaction_code' })
    transactionCode: string;

    @Column({ name: 'access_key' })
    accessKey: string;

    @Column()
    status: number;

    @Column({name: 'remote_host'})
    remoteHost: string;

    @Column({name: 'request_body', type: 'json'})
    requestBody: any;
}