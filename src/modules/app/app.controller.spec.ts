import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  const mockResult = { data: 'ok' };

  beforeEach(async () => {
    const mockAppService = {
      callERP_ConsultaPrecoProduto: jest.fn().mockResolvedValue(mockResult),
    } as Partial<AppService>;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('carregaDepositosProduto', () => {
    it('should return data from AppService', async () => {
      const res = await appController.carregaDepositosProduto('123');
      expect(res).toEqual(mockResult);
    });
  });
});
