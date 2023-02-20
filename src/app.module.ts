import { Module } from '@nestjs/common';
import { CommonModule } from './common-module/common.module';
import { AdminModule } from './admin-module/admin.module';
import { MainModule } from './main-module/main.module';
import { ConfigModule } from '@nestjs/config';
// import { APP_FILTER } from '@nestjs/core';
// import { HttpExceptionFilter } from './common-module/filter/http-exception-filter.filter';
import { LdapModule } from './ldap-module/ldap.module';
import { TypeOrmModule } from '@nestjs/typeorm';

const dbDefaultOptions: any = {}

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      ignoreEnvVars: true
    }),
    //https://docs.nestjs.com/techniques/database#multiple-databases
    TypeOrmModule.forRoot({
      ...dbDefaultOptions,
      type: 'mysql',
      host: process.env['data-source.host'],
      port: parseInt(process.env['data-source.port']),
      username: process.env['data-source.username'],
      password: process.env['data-source.password'],
      database: process.env['data-source.database'],
      // entities: [],
      autoLoadEntities: true,
      synchronize: process.env['data-source.synchronize'] === 'true',
      poolSize: process.env['data-source.pool-size'] ? parseInt(process.env['data-source.pool-size']) : 5,
      logging: ['error'],
      logger: 'simple-console',
      timezone: '+07:00',
    }),
    CommonModule,
    AdminModule,
    LdapModule,
    MainModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // }
  ],
})
export class AppModule {
}
