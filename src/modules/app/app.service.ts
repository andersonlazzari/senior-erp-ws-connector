import { Injectable } from '@nestjs/common';
import { SeniorSoapClient } from '../senior/senior.module';

@Injectable()
export class AppService {
  constructor(private readonly senior: SeniorSoapClient) { }

  async callERP_ConsultaPrecoProduto(codPrd: string): Promise<any> {
    const wsdlUrl = 'sapiens_Synccom_senior_g5_co_cad_produtos?wsdl';
  
    const conn = this.senior.openConnection(wsdlUrl);
    const result = await conn.call('ConsultarGeral_5', {
        codEmp: '1',
        codFil: '1',
        IndicePagina: 1,
        LimitePagina: 1,
        SitPro: 'A',
        SitDer: 'A',
        identificadorSistema: 'SCRAP',
        codPro: {
          codPro: codPrd
        }
      },);

    return result;
  }
}
