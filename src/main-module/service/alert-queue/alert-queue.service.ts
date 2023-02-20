import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AlertQueue } from '../../entity/alert-queue/alert-queue.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import * as moment from 'moment';
import { ObjectUtils } from 'src/common-module/utils/convert/object.utils';

@Injectable()
export class AlertQueueService extends BaseEntityService {
    constructor(@InjectRepository(AlertQueue) public entityRepository: Repository<AlertQueue>,
        @InjectDataSource() private dataSource: DataSource) {
        super(entityRepository);
    }

    /**
     * Thống kê trạng thái gửi SMS theo ngày của 30 ngày gần nhất
     * @returns 
     */
    statisticStateByDay(): Promise<any[]> {
        let calendar: moment.Moment = moment()
        calendar.add(-30, 'day')
        return new Promise((resolve, reject) => {
            let sqlCmd: string = `select DATE_FORMAT(taq.sent_at,'%Y-%m-%d') as sentAt, taq.status, count(1) as count
                                from tbl_alert_queue taq
                                where taq.sent_at >= ?
                                group by DATE_FORMAT(taq.sent_at,'%Y-%m-%d'), taq.status`
            this.dataSource.query(sqlCmd, [calendar.startOf('day').toDate()]).then((values: any[]) => {
                values = ObjectUtils.mergeDataByKey('sentAt', values, {
                    labelKey: 'status', valueKey: 'count'
                })
                resolve(values)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Thống kê trạng thái kênh gửi SMS theo ngày của 30 ngày gần nhất
     * @returns 
     */
    statisticChannelByDay(): Promise<any[]> {
        let calendar: moment.Moment = moment()
        calendar.add(-30, 'day')
        return new Promise((resolve, reject) => {
            let sqlCmd: string = `select DATE_FORMAT(taq.sent_at,'%Y-%m-%d') as sentAt, taq.channel, count(1) as count
                                from tbl_alert_queue taq
                                where taq.sent_at >= ?
                                group by DATE_FORMAT(taq.sent_at,'%Y-%m-%d'), taq.channel`
            this.dataSource.query(sqlCmd, [calendar.startOf('day').toDate()]).then((values: any[]) => {
                values = ObjectUtils.mergeDataByKey('sentAt', values, {
                    labelKey: 'channel', valueKey: 'count'
                })
                resolve(values)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Thống kê theo consumer theo ngày của 30 ngày gần nhất
     * @returns 
     */
    statisticConsumerByDay(): Promise<any[]> {
        let calendar: moment.Moment = moment()
        calendar.add(-30, 'day')
        return new Promise((resolve, reject) => {
            let sqlCmd: string = `select DATE_FORMAT(taq.sent_at,'%Y-%m-%d') as sentAt, tae.consumer_code as consumerCode, count(1) as count
                                from tbl_alert_queue taq
                                left join tbl_alert_event tae on tae.id = taq.alert_event_id
                                where taq.sent_at >= ?
                                group by DATE_FORMAT(taq.sent_at,'%Y-%m-%d'), tae.consumer_code`
            this.dataSource.query(sqlCmd, [calendar.startOf('day').toDate()]).then((values: any[]) => {
                values = ObjectUtils.mergeDataByKey('sentAt', values, {
                    labelKey: 'consumerCode', valueKey: 'count'
                })
                resolve(values)
            }).catch(e => {
                reject(e)
            })
        })
    }
}
