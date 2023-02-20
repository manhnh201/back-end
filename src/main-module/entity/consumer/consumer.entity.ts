import { Entity, Column, BeforeInsert, BeforeUpdate, BeforeRemove } from 'typeorm';
import { BaseEntity } from 'src/common-module/entity/base/base.entity';

@Entity({ name: 'tbl_consumer' })
export class Consumer extends BaseEntity {
    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    enabled: number;

    @Column({type: 'json'})
    props: any = {}
}