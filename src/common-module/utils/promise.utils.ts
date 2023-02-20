import * as _ from "lodash";

/**
 * 
 * @param {*} items danh sách đối tượng cần xử lý song song
 * @param {*} handler hàm xử lý đối tượng trong items, trả về Promise
 * @param {*} promiseMaxCount
 */
export async function limit(items: any[], handler: (item: any) => Promise<any>, promiseMaxCount: any = 10): Promise<any> {
    let __promiseList = []
    let __items = _.cloneDeep(items)
    for (let idx = 0; idx < promiseMaxCount; idx++) {
        __promiseList.push(__exec(__items, handler, { chain: [] }))
    }

    await Promise.allSettled(__promiseList)
}

function __exec(items: any[], handler: (item: any) => Promise<any>, options = {}) {
    let item: any;
    try {
        item = items.shift()
        if (item) {
            Promise.allSettled([handler(item)]).then(() => {
                return __exec(items, handler, options)
            })
        }
    } catch (e) {
        
    }

}