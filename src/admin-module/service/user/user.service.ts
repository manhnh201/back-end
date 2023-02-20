import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/admin-module/entity/user/user.entity';
import { BaseEntityService } from 'src/common-module/service/base-entity/base-entity.service';
import { JwtProvider } from 'src/common-module/utils/auth-provider/jwt.provider';
import { compareSync } from 'bcrypt';
import { Role } from 'src/admin-module/entity/role/role.entity';
import { IUserDirectory } from './i-user-directory';
import { plainToInstance } from 'class-transformer';
import * as _ from 'lodash';
import { Personal } from 'src/admin-module/entity/personal/personal.entity';
import { UserDetail } from 'src/admin-module/dto/user/user.dto';
import { Menu } from 'src/admin-module/entity/menu/menu.entity';

@Injectable()
export class UserService extends BaseEntityService {
    private readonly log = new Logger(UserService.name);

    static otherUserDirectories: IUserDirectory[] = [];

    constructor(@InjectDataSource() private dataSource: DataSource,
        @InjectRepository(User) public entityRepository: Repository<User>,
        @InjectRepository(Personal) public personalRepository: Repository<Personal>,
        private jwtProvider: JwtProvider) {
        super(entityRepository);
    }

    get(id: any): Promise<any> {
        return this.entityRepository.findOne({ where: { id: id }, relations: { roles: true, personal: true } })
    }

    override save(item: any): Promise<any> {
        let __item = plainToInstance(User, item)
        Object.keys(item).forEach((key) => {
            __item[key] = item[key]
        })
        return new Promise((resolve, reject) => {
            this.entityRepository.save(__item).then((user: User) => {
                if (!_.isEmpty(__item.personal)) {
                    let __personal = plainToInstance(Personal, __item.personal)
                    __personal.user = user
                    this.personalRepository.save(__personal).then((personal: Personal) => {
                        user.personal = personal;
                        resolve(user)
                    }).catch(e => {
                        reject(e)
                    });
                }
                resolve(user)
            }).catch(e => {
                reject(e)
            });
        })
    }

    override update(id: any, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({ where: { id: id }, relations: { personal: true } }).then((__item: any) => {
                if (!__item) {
                    resolve(null)
                    return
                }

                let personal: any = {}
                _.assign(personal, __item.personal)
                _.assign(personal, item.personal)

                _.assign(__item, item)
                delete __item.personal
                __item.roles = []

                if (_.isEmpty(__item.password)) delete __item.password

                this.entityRepository.save(__item).then((user: User) => {
                    let __personal = plainToInstance(Personal, personal)
                    __personal.user = user
                    this.personalRepository.save(__personal).then((personal: Personal) => {
                        __item.roles = item.roles
                        this.entityRepository.save(__item).then((user: User) => {
                            resolve(user)
                        }).catch((e) => {
                            reject(e)
                        })
                    }).catch(e => {
                        reject(e)
                    });
                }).catch((e) => {
                    reject(e)
                })
            }).catch((e) => {
                reject(e)
            })
        })
    }

    override delete(id: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({
                where: {
                    id: id
                },
                relations: {
                    personal: true
                }
            }).then(item => {
                if (!item) {
                    resolve(null)
                    return
                }

                this.personalRepository.remove((item.personal)).then(() => {
                    this.entityRepository.remove(item).then((item) => {
                        resolve(item)
                    }).catch(e => {
                        reject(e)
                    })
                }).catch(e => {
                    reject(e)
                })
            }).catch(e => {
                reject(e)
            })
        })
    }

    login(username: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.entityRepository.findOne({
                where: { username: username, deleted: In([null, false, 0]) },
                relations: { roles: true }
            }).then(async (item: User) => {
                if (!item || !item.enabled || item.accountExpired || item.accountLocked || item.passwordExpired) {
                    resolve(null)
                    return
                }

                let match: boolean = compareSync(password, item.password.substring('{bcrypt}'.length, item.password.length))
                for (let idx = 0; idx < UserService.otherUserDirectories.length && match === false; idx++) {
                    let userDirectory: IUserDirectory = UserService.otherUserDirectories[idx]
                    try {
                        match ||= await userDirectory.check(username, password)
                    } catch (e) {
                        this.log.error(e)
                    }
                }
                if (!match) {
                    resolve(null)
                    return
                }

                let userDetail = {
                    username: item.username,
                    authorities: item.roles.map((item: Role) => { return item.authority })
                }

                resolve(this.jwtProvider.createResponsePayload(userDetail))
            })
        })
    }

    /**
     * Trả thông tin user theo username
     * @param username 
     * @returns 
     */
    findByUsername(username: string): Promise<any> {
        return this.entityRepository.findOne({ where: { username: username } })
    }

    /**
     * Lấy danh sách menu khả dụng
     * @param userDetail 
     */
    menu(userDetail: UserDetail): Promise<Menu[]> {
        return new Promise((resolve, reject) => {
            let sqlCmd = `select tm.id, tm.code, tm.name, tm.hide, tm.href, tm.icon, tm.ord, tm.parent_id as parentId, tm.active
                        from tbl_user tu
                        left join tbl_user_role tur on tu.id = tur.user_id
                        left join tbl_domain_mapping tdm on tdm.first_id = tur.role_id and tdm.first_domain = 'role'
                        left join tbl_menu tm on tm.id = tdm.second_id and tdm.second_domain = 'menu'
                        where tu.username = ? and tm.id is not null
                        order by tm.ord asc`
            this.dataSource.query(sqlCmd, [userDetail.username]).then((values: any[]) => {
                values.forEach((item: any) => {
                    item.hide = item.hide === 1
                })
                resolve(values)
            }).catch(e => {
                reject(e)
            })
        })
    }

    public static regUserDirectory(userDirectory: IUserDirectory) {
        UserService.otherUserDirectories.push(userDirectory)
    }
}
