import { Injectable, DynamicModule, Module, Inject, Global, Logger } from '@nestjs/common';
import { soap } from 'strong-soap';
import pRetry from 'p-retry';
import pTimeout from 'p-timeout';

export interface SeniorModuleOptions {
  seniorErpUrl: string;       // URL base do ERP Senior
  seniorErpUser: string;      // Usuário do ERP Senior
  seniorErpPassword: string;  // Senha do ERP Senior
  encryption: number;        // 0 = sem criptografia, 1 = criptografia simples, etc.  
  timeoutMs?: number;         // Timeout padrão para requisições SOAP
  retries?: number;           // Número de tentativas de retry para falhas temporárias
}

interface InvokeOptions {
  porta: string;            // Nome da operação exata (ex: ConsultarGeral)
  parameters: Record<string, any>; // Parâmetros esperados (conforme o WSDL)
}

@Global()
@Module({})
export class SeniorModule {
  static register(options: SeniorModuleOptions): DynamicModule {
    return {
      module: SeniorModule,
      providers: [
        {
          provide: 'SENIOR_MODULE_OPTIONS',
          useValue: options,
        },
        SeniorWebService,
        SeniorSoapClient,
      ],
      exports: [SeniorWebService, SeniorSoapClient],
    };
  }
}

@Injectable()
export class SeniorSoapClient {
  constructor(
    @Inject('SENIOR_MODULE_OPTIONS') private options: SeniorModuleOptions,
  ) { }

  public openConnection(wsd: string):SeniorWebService { 
    const conn = new SeniorWebService(this.options, wsd);
    return conn;
  }
}

class SeniorWebService {  
  private readonly logger = new Logger(SeniorWebService.name);

  constructor(private seniorOptions: SeniorModuleOptions, private wsdlUrl: string) { }

  private async invoke<T = any>(opts: InvokeOptions): Promise<T> {
    const {
      porta,
      parameters,
    } = opts;

    const user = this.seniorOptions.seniorErpUser ?? '';
    const password = this.seniorOptions.seniorErpPassword ?? '';
    const encryption = this.seniorOptions.encryption;
    const timeoutMs = this.seniorOptions.timeoutMs ?? 180000;
    const retries = this.seniorOptions.retries ?? 0;

    const erpUrl = this.seniorOptions.seniorErpUrl ?? '';

    this.logger.debug(`Invocando a porta: ${porta} (${erpUrl+this.wsdlUrl})`);

    const exec = async (): Promise<T> => {
      return new Promise((resolve, reject) => {
        soap.createClient(erpUrl+this.wsdlUrl, {}, (err, client) => {
          if (err) return reject(err);

          if (typeof client[porta] !== 'function') {
            return reject(new Error(`Porta '${porta}' não encontrada no WSDL.`));
          }

          const args = { user, password, encryption, parameters };

          client[porta](args, (err: any, result: any, rawResponse: string) => {
                console.log('Last Request:', client.lastRequest); // Log the full request here

            if (err) return reject(err);

            this.logger.debug(`SOAP 'Response' recebido da porta ${porta}`);
            resolve(result);
          });
        });
      });
    };

    const result = await pRetry<T>(async () => {
      const res = await pTimeout<T>(
        exec(), // sua promise
        {
          milliseconds: timeoutMs,                     // tempo limite
          message: `Timeout de ${timeoutMs}ms na operação SOAP.` // mensagem de erro
        }
      );

      if (res === undefined) throw new Error('Promise retornou undefined'); // garante T
      return res;
    }, {
      retries,
      factor: 2,
      minTimeout: 1000,
    });

    return result;
  }

  async call(porta: string, parameters: Record<string, any>): Promise<any> {
    return this.invoke({ porta, parameters });
  }
}