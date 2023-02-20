import { Injectable } from "@nestjs/common";
import { UserService } from "src/admin-module/service/user/user.service";
import { LdapUserDirector } from "./ldap-user-directory.service";

@Injectable()
export class LDAPService {
    constructor() {
        UserService.regUserDirectory(new LdapUserDirector())
    }
}