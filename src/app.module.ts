import { Module } from '@nestjs/common';
import { AppController } from './modules/app/app.controller';
import { AppService } from './modules/app/app.service';
import { SeniorModule } from './modules/senior/senior.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SeniorModule.register({
      seniorErpUrl: process.env.SENIOR_ERP_URL ?? '',
      seniorErpUser: process.env.SENIOR_ERP_USER ?? '',
      seniorErpPassword: process.env.SENIOR_ERP_PASSWORD ?? '',
      encryption: parseInt(process.env.SENIOR_ERP_ENCRYPTION ?? '0'),
      timeoutMs: parseInt(process.env.SENIOR_ERP_TIMEOUT_MS ?? '180000'),
      retries: parseInt(process.env.SENIOR_ERP_RETRIES ?? '0'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
