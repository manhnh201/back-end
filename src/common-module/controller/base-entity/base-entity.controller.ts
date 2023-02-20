import { Body, Delete, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { DataTableFilter } from 'src/common-module/dto/data-table-filter.dto';
import { plainToClass } from 'class-transformer';
import { DataTableResponse } from 'src/common-module/dto/data-table-response.dto';
import { UserDetail } from 'src/admin-module/dto/user/user.dto';

export abstract class BaseEntityController {
    /**
     * Các field không trả về qua API
     */
    __getExcludeKeys: string[] = ['createdBy', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy']

    /**
     * Các field không thể cập nhật bằng API
     */
    __updateExcludeFields: string[] = ['id', 'uuid', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'version']

    /**
     * Các field không thể cập nhật khi thêm mới bằng API
     */
    __createExcludeFields: string[] = ['id', 'uuid', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt', 'deleted', 'deletedAt', 'deletedBy', 'version']

    constructor(public entityService: BaseEntityService) { }

    @Get()
    index(@Res() res: Response) {
        this.entityService.list().then((items: any) => {
            let __items = items.map((item: any) => {
                return this.entityService.modifyData(item, this.__getExcludeKeys)
            })
            res.send(__items)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get('/:id(\\d+)')
    get(@Param('id') id: number, @Res() res: Response) {
        this.entityService.get(id).then((item: any) => {
            let __item: any
            if (item) {
                __item = this.entityService.modifyData(item, this.__getExcludeKeys)
                res.json(__item)
                return
            }
            res.status(404).send()
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    /**
     * Call sau khi api save xử lý xong
     */
    onAfterSave() { }

    @Post()
    save(@Body() body: any, @Req() req: Request, @Res() res: Response) {
        body = this.entityService.modifyData(body, this.__createExcludeFields)
        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['createdBy'] = __userDetail.username
        }

        this.entityService.save(body).then(item => {
            if (item == null) {
                res.status(404).send()
                return
            }
            this.onAfterSave();
            res.send(this.entityService.modifyData(item, this.__getExcludeKeys))
        }).catch(e => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    /**
     * Call sau khi api update xử lý xong
     */
    onAfterUpdate() { }

    @Put('/:id(\\d+)')
    update(@Param('id') id: Number, @Body() body: any, @Req() req: Request, @Res() res: Response) {
        body = this.entityService.modifyData(body, this.__updateExcludeFields)
        let __userDetail: UserDetail = req['userDetail']
        if (__userDetail) {
            body['updatedBy'] = __userDetail.username
        }

        this.entityService.update(id, body).then(item => {
            if (!item) {
                res.status(404).send()
                return
            }
            this.onAfterUpdate()
            res.send(this.entityService.modifyData(item, this.__getExcludeKeys))
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    /**
     * Call sau khi api delete xử lý xong
     */
    onAfterDelete() { }

    @Delete('/:id(\\d+)')
    delete(@Param('id') id: Number, @Res() res: Response) {
        this.entityService.delete(id).then((item) => {
            if (!item) {
                res.status(404).send()
                return
            }
            this.onAfterDelete();
            res.send(this.entityService.modifyData(item, this.__getExcludeKeys))
        }).catch(e => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get(['/load-data-table', '/loadDataTable'])
    loadDataTable(@Req() request: Request, @Res() res: Response) {
        if (request.query.filters) {
            request.query.filters = JSON.parse(request.query.filters.toString())
        }
        let dataTableFilter = plainToClass(DataTableFilter, request.query, {
            enableImplicitConversion: true,
        })

        this.entityService.loadDataTable(dataTableFilter).then((data) => {
            let dataTableResponse = new DataTableResponse()
            dataTableResponse.first = dataTableFilter.first;
            dataTableResponse.rows = dataTableFilter.rows;
            dataTableResponse.items = data[0].map((item: any) => {
                return this.entityService.modifyData(item, this.__getExcludeKeys);
            });
            dataTableResponse.totalRows = data[1];
            res.send(dataTableResponse);
        }).catch((e) => {
            let generalResponse = new GeneralResponse();
            generalResponse.code = ResponseCode.ERROR;
            generalResponse.message = e.message;
            res.status(500).send(generalResponse);
        })
    }
}
