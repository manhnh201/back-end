import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_alert_queue' })
export class AlertQueue extends BaseEntity {
    @Column({ name: 'transaction_code', length: '32' })
    transactionCode: string

    @Column({ name: 'channel', length: '32' })
    channel: string

    @Column({ name: 'status' })
    status: number

    @Column({ name: 'sent_at' })
    sentAt: Date

    @Column({ name: 'retry_count' })
    retryCount: number

    @Column({ name: 'alert_to' })
    alertTo: string

    @Column()
    content: string

    @Column()
    provider: string

    @Column({ name: 'error_content' })
    errorContent: string
}