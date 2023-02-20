import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_integration_hist' })
export class IntegrationHist extends BaseEntity {
}