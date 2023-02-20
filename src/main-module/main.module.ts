import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common-module/common.module';
import { AlertQueue } from './entity/alert-queue/alert-queue.entity';
import { AlertQueueStatistic } from './entity/alert-queue-statistic/alert-queue-statistic.entity';

import { AlertQueueService } from './service/alert-queue/alert-queue.service';
import { AlertQueueStatisticService } from './service/alert-queue-statistic/alert-queue-statistic.service';

import { AlertQueueController } from './controller/alert-queue/alert-queue.controller';
import { AlertChannel } from './entity/alert-channel/alert-channel.entity';
import { AlertChannelController } from './controller/alert-channel/alert-channel.controller';
import { AlertChannelService } from './service/alert-channel/alert-channel.service';
import { AlertEvent } from './entity/alert-event/alert-event.entity';
import { AlertEventController } from './controller/alert-event/alert-event.controller';
import { AlertEventService } from './service/alert-event/alert-event.service';
import { Consumer } from './entity/consumer/consumer.entity';
import { ConsumerController } from './controller/consumer/consumer.controller';
import { ConsumerService } from './service/consumer/consumer.service';
import { ConsumerKey } from './entity/consumer-key/consumer-key.entity';
import { ConsumerKeyController } from './controller/consumer-key/consumer-key.controller';
import { ConsumerKeyService } from './service/consumer-key/consumer-key.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([AlertChannel, AlertEvent, AlertQueue, AlertQueueStatistic, Consumer, ConsumerKey]),
        CommonModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AlertChannelController, AlertEventController, AlertQueueController, ConsumerController, ConsumerKeyController],
    providers: [AlertChannelService, AlertEventService, AlertQueueService, AlertQueueStatisticService, ConsumerService, ConsumerKeyService],
    exports: [TypeOrmModule]
})
export class MainModule { }
