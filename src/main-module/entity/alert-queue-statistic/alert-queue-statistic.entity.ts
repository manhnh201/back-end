import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_alert_queue_statistic' })
export class AlertQueueStatistic {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({ nullable: true, name: 'created_at' })
    createdAt: Date = new Date();

    @Column({ nullable: false, name: 'type' })
    type: AlertQueueStatisticTypeEnum;

    @Column()
    year: number;

    @Column()
    month: number;

    @Column()
    day: number;

    @Column()
    hour: number;

    @Column()
    min: number;

    @Column()
    sec: number;

    @Column({ type: 'json' })
    data?: any = {};

    @Column({ name: 're_calc' })
    reCalc: boolean = false;
}

export enum AlertQueueStatisticTypeEnum {
    minutely = 'minutely',
    hourly = 'hourly',
    daily = 'daily'
}