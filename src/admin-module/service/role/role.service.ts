import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/admin-module/entity/role/role.entity';
import { Repository } from 'typeorm';
import { BaseEntityService } from '../../../common-module/service/base-entity/base-entity.service';
import { DomainMappingService } from '../domain-mapping/domain-mapping.service';
import { GeneralResponse } from 'src/common-module/dto/general-response.dto';
import { DomainMapping } from 'src/admin-module/entity/domain-mapping/domain-mapping.entity';

@Injectable()
export class RoleService extends BaseEntityService {
    constructor(@InjectRepository(Role) public entityRepository: Repository<Role>, private domainMappingService: DomainMappingService) {
        super(entityRepository)
    }

    /**
     * Lấy danh sách menu Id mà role có quyền truy cập
     * @param id 
     * @returns 
     */
    menuIds(id: number): Promise<GeneralResponse> {
        return new Promise((resolve, reject) => {
            let generalResponse = new GeneralResponse()
            this.domainMappingService.loadDataTable({
                filters: {
                    firstDomain: { matchMode: 'equals', value: 'role' },
                    firstId: { matchMode: 'equals', value: id },
                },
                rows: 1000
            }).then((data: any[]) => {
                generalResponse.value = data[0].map((domainMapping: DomainMapping) => {
                    return domainMapping.secondId;
                });
                resolve(generalResponse)
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Cập nhật danh sách menu Id mà role có quyền truy cập
     * @param id 
     * @param menuIds 
     * @returns 
     */
    updateMenu(id: number, menuIds: number[]): Promise<GeneralResponse> {
        return new Promise((resolve, reject) => {
            let generalResponse = new GeneralResponse()
            this.domainMappingService.smartJoin('role', id, 'menu', menuIds).then((rs) => {
                generalResponse.value = rs;
                resolve(generalResponse)
            }).catch(e => {
                reject(e)
            })
        })
    }
}
