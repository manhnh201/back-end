import { Controller, Post, Req, Res } from '@nestjs/common';
import { UserService } from '../../service/user/user.service';
import { BaseEntityController } from '../../../common-module/controller/base-entity/base-entity.controller';
import { Request, Response } from 'express';
import { GeneralResponse, ResponseCode } from 'src/common-module/dto/general-response.dto';
import { Body, Get, Param, Put, UseGuards } from '@nestjs/common/decorators';
import { UserDetail } from 'src/admin-module/dto/user/user.dto';
import { plainToClass } from 'class-transformer';
import { DataTableFilter } from 'src/common-module/dto/data-table-filter.dto';
import { DataTableResponse } from 'src/common-module/dto/data-table-response.dto';
import { MenuService } from 'src/admin-module/service/menu/menu.service';
import { Menu } from 'src/admin-module/entity/menu/menu.entity';
import { RoleGuard } from 'src/admin-module/guard/role.guard';

@Controller('/api/v1/user')
export class UserController extends BaseEntityController {
    constructor(public entityService: UserService, private menuService: MenuService) {
        super(entityService)
        this.__getExcludeKeys = this.__getExcludeKeys.concat(['password'])
        this.__updateExcludeFields = this.__updateExcludeFields.concat(['username', 'accountExpired', 'accountLocked', 'passwordExpired',])
        this.__createExcludeFields = this.__createExcludeFields.concat(['enabled', 'accountExpired', 'accountLocked', 'passwordExpired',])
    }

    @Post()
    override save(@Body() body: any, @Req() req: Request, @Res() res: Response) {
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
            res.send(this.entityService.modifyData(item, this.__getExcludeKeys))
        }).catch(e => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Put('/:id(\\d+)')
    override update(@Param('id') id: Number, @Body() body: any, @Req() req: Request, @Res() res: Response) {
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
            res.send(this.entityService.modifyData(item, this.__getExcludeKeys))
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get(['/load-data-table', '/loadDataTable'])
    override loadDataTable(@Req() request: Request, @Res() res: Response) {
        if (request.query.filters) {
            request.query.filters = JSON.parse(request.query.filters.toString())
        }
        let dataTableFilter = plainToClass(DataTableFilter, request.query, {
            enableImplicitConversion: true,
        })

        this.entityService.loadDataTable(dataTableFilter, { relations: { personal: true } }).then((data) => {
            let dataTableResponse = new DataTableResponse()
            dataTableResponse.first = dataTableFilter.first;
            dataTableResponse.rows = dataTableFilter.rows;
            dataTableResponse.items = data[0].map((item: any) => {
                item.personal = this.entityService.modifyData(item.personal, this.__getExcludeKeys);
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

    @Post('/login')
    login(@Req() req: Request, @Res() res: Response) {
        this.entityService.login(req.body['username'], req.body['password']).then((value) => {
            if (!value) {
                res.status(401).send()
                return
            }
            res.json(value)
        }).catch(e => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = -1
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }

    @Get('/logout')
    logout(@Req() req: Request, @Res() res: Response) {
        res.send()
    }

    @Post('/sessionExtend')
    sessionExtend(@Req() req: Request, @Res() res: Response) {
        res.status(401).send()
    }

    @Get('/getCurrentUser')
    getCurrentUser(@Req() req: Request, @Res() res: Response) {
        let userDetail: UserDetail = req['userDetail']
        this.entityService.findByUsername(userDetail.username).then((item: any) => {
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

    @UseGuards(RoleGuard)
    @Get('/menu')
    menu(@Req() req: Request, @Res() res: Response) {
        let userDetail: UserDetail = req['userDetail']
        this.entityService.menu(userDetail).then((items: Menu[]) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.SUCCESS
            generalResponse.value = items
            res.send(generalResponse)
        }).catch((e) => {
            let generalResponse = new GeneralResponse()
            generalResponse.code = ResponseCode.ERROR
            generalResponse.message = e.message
            res.status(500).send(generalResponse)
        })
    }
}
