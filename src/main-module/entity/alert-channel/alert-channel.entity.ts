import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_alert_channel' })
export class AlertChannel extends BaseEntity {
    @Column()
    code: string;

    @Column()
    name: string;

    @Column({ type: 'json' })
    props: any;

    @Column()
    enabled: number;

    @Column()
    type: string;
}