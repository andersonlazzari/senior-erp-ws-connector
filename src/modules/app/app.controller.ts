import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('preco/:id')
  async carregaDepositosProduto(
    @Param('id') prd_id: string
  ) {
    return this.appService.callERP_ConsultaPrecoProduto(prd_id);
  }
}
