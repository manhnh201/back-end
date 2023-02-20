import { Body, Controller, Get, Param, Post, Put, Req, Res } from '@nestjs/common';
import { RoleService } from 'src/admin-module/service/role/role.service';
import { BaseEntityController } from '../../../common-module/controller/base-entity/base-entity.controller';
import { Request, Response } from 'express';

@Controller('api/v1/role')
export class RoleController extends BaseEntityController {
    constructor(public entityService: RoleService) {
        super(entityService)
    }

    @Get(['/:id(\\d+)/menu-ids', '/:id(\\d+)/get-menu-ids', '/:id(\\d+)/getMenuIds'])
    menuIds(@Param('id') id: number, @Req() req: Request, @Res() res: Response) {
        this.entityService.menuIds(id).then((rs) => {
            res.send(rs)
        })
    }

    @Put(['/:id(\\d+)/update-menu', '/:id(\\d+)/updateMenu'])
    updateMenu(@Param('id') id: number, @Body() body: any | any[], @Req() req: Request, @Res() res: Response) {
        this.entityService.updateMenu(id, body).then((rs) => {
            res.send(rs)
        })
    }
}
