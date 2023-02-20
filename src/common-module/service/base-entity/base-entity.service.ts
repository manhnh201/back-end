import { Between, FindOptionsRelations, In, Like, Not, Repository } from 'typeorm';
import * as _ from "lodash";
import { DataTableFilter, Filter, SortOrder } from 'src/common-module/dto/data-table-filter.dto';
import { plainToInstance } from 'class-transformer';
import { DateTimeConvert } from 'src/common-module/utils/convert/datetime-convert.utils';
import { ObjectUtils } from 'src/common-module/utils/convert/object.utils';

export class BaseEntityService {
    constructor(public entityRepository: Repository<any>) { }

    /**
     * Lấy danh sách all record
     * @returns 
     */
    list(): Promise<any[]> {
        return this.entityRepository.find();
    }

    /**
     * Lấy 1 record theo PK
     * @param id 
     * @returns 
     */
    get(id: any, options: { relations?: FindOptionsRelations<any> } = {}): Promise<any> {
        return this.entityRepository.findOne({ where: { id: id }, relations: options.relations })
    }

    /**
     * Thêm record
     * @param item 
     * @returns 
     */
    save(item: any): Promise<any> {
        let __clazz: any = this.entityRepository.target
        let __item = plainToInstance(__clazz, item)
        Object.keys(item).forEach((key) => {
            __item[key] = item[key]
        })
        return this.entityRepository.save(__item);
    }

    /**
     * Cập nhật 1 record theo PK
     * @param id 
     * @param item 
     * @returns 
     */
    update(id: any, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { id: id } }).then((__item: any) => {
                if (!__item) {
                    resolve(null)
                    return
                }
                _.assign(__item, item)
                this.entityRepository.save(__item).then((value) => {
                    resolve(value)
                }).catch((e) => {
                    reject(e)
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }

    /**
     * Xóa 1 record theo PK
     * @param id 
     * @returns 
     */
    delete(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { id: id } }).then(item => {
                if (!item) {
                    resolve(null)
                    return
                }

                this.entityRepository.remove(item).then((item) => {
                    resolve(item)
                }).catch(e => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })
    }

    /**
     * Trả danh sách dữ liệu phân trang
     * @param dataTableFilter 
     * @returns 
     */
    loadDataTable<T>(dataTableFilter: DataTableFilter, options: { relations?: FindOptionsRelations<T> } = {}): Promise<[T[], number]> {
        dataTableFilter.first = dataTableFilter.first || 0
        dataTableFilter.rows = dataTableFilter.rows || 10
        dataTableFilter.filters = dataTableFilter.filters || {}
        if (!dataTableFilter.sortField || dataTableFilter.sortField === 'undefined') {
            dataTableFilter.sortField = 'id'
        }
        if (!dataTableFilter.sortOrder) {
            dataTableFilter.sortOrder = SortOrder.DESC
        }

        let __queryClause: any = {}
        let __filters: Filter[] = this.__orderFilter(dataTableFilter.filters)
        __filters.forEach((__filter) => {
            let key = __filter.code;
            if (_.isEmpty(__filter.dataType)) __filter.dataType = 'string';

            switch (__filter.matchMode) {
                case "equals":
                    this.__setKey(__queryClause, key, __filter.value)
                    break;
                case "not":
                    this.__setKey(__queryClause, key, Not(__filter.value))
                    break;
                case "contains":
                    this.__setKey(__queryClause, key, Like(`%${__filter.value}%`))
                    break;
                case "startsWith":
                    this.__setKey(__queryClause, key, Like(`${__filter.value}%`));
                    break;
                case "endsWith":
                    this.__setKey(__queryClause, key, Like(`%${__filter.value}`));
                    break;
                case "inList":
                    /**
                     * Trường hợp là string thì cần chuyển về Array
                     */
                    if (_.isString(__filter.value)) {
                        __filter.value = JSON.parse(__filter.value);
                    }
                    this.__setKey(__queryClause, key, In(__filter.value));
                case "notInList":
                case "greaterThan":
                case "greaterThanOrEquals":
                case "lowersThan":
                case "lowersThanOrEquals":
                case "between":
                    switch (__filter.dataType) {
                        case 'string':
                        case 'number':
                        case 'datetime':
                            __filter.value = [DateTimeConvert.parse(__filter.value[0]), DateTimeConvert.parse(__filter.value[1])]
                            break;
                    }
                    this.__setKey(__queryClause, key, Between(__filter.value[0], __filter.value[1]));
                    break;
            }
        })
        let __orders: any = {}
        __orders[dataTableFilter.sortField] = dataTableFilter.sortOrder === SortOrder.DESC ? 'DESC' : 'ASC'
        return this.entityRepository.findAndCount({
            where: __queryClause,
            skip: dataTableFilter.first,
            take: dataTableFilter.rows,
            order: __orders,
            relations: options.relations
        });
    }

    /**
     * Bỏ bớt trường dữ liệu
     * @param item 
     * @param excludeKeys 
     * @returns 
     */
    modifyData(item: any, excludeKeys: string[] = []) {
        if (_.isEmpty(item)) return item
        let __item = _.cloneDeep(item)
        excludeKeys.forEach((key: any) => {
            delete __item[key]
        })
        return __item
    }

    /**
     * Flat member trong props của object
     * @param item 
     * @returns 
     */
    flatObject(item: any) {
        return ObjectUtils.flatObject(item)
    }

    /**
     * Tự động tạo Object theo key truyền vào
     * @param obj 
     * @param key pattern dạng *.*.*..., vd: key1.key2.key3
     * @param value 
     */
    __setKey(obj: any, key: string, value: any) {
        ObjectUtils.setKey(obj, key, value)
    }

    /**
     * Trả về mảng filter theo thứ tự ưu tiên
     * @param filters 
     */
    __orderFilter(filters: Record<string, Filter>): Filter[] {
        let __filters: Filter[] = [];
        Object.keys(filters).forEach((key: string) => {
            filters[key].code = key
            __filters.push(filters[key])
        })
        __filters = __filters.sort((a, b) => {
            return a.order >= b.order ? 1 : -1;
        })
        return __filters
    }
}
