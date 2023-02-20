import * as _ from "lodash"

export class ObjectUtils {
    
    /**
     * Flat member trong props của object
     * @param item 
     * @param key 
     * @returns 
     */
    static flatObject(item: any, key: string = 'props') {
        let __item = _.cloneDeep(item)
        if (__item[key]) {
            _.assign(__item, __item[key])
            delete __item[key]
        }
        return __item
    }

    /**
     * Tự động tạo Object theo key truyền vào
     * @param obj 
     * @param key pattern dạng *.*.*..., vd: key1.key2.key3
     * @param value 
     */
    static setKey(obj: any, key: string, value: any) {
        let __keys = key.split('.')
        if (__keys.length < 2) {
            obj[__keys[0]] = value
        } else {
            let __key = __keys.shift()
            obj[__key] = {}
            ObjectUtils.setKey(obj[__key], __keys.join('.'), value)
        }
    }

    /**
     * Gộp các record có cùng giá trị key
     * @param key 
     * @param data 
     * @returns 
     */
    static mergeDataByKey(key: string, data: any[], options?: { labelKey: string, valueKey: string }) {
        let __data: any = {}
        data.forEach((item) => {
            const __key = item[key].toString()
            if (!__data[__key]) {
                __data[__key] = {}
                __data[__key][key] = item[key]
            }
            if (options) {
                __data[__key][item[options.labelKey]] = item[options.valueKey]
            } else {
                _.assign(__data[__key], item)
            }
        })
        return Object.values(__data)
    }
}