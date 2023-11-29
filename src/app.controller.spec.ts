import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpStatus } from '@nestjs/common';
import { IRes } from './common/interfaces';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return a successful server health status', async () => {
      const expectedResponse: IRes = {
        status_code: HttpStatus.OK,
        detail: 'ok',
        result: 'working',
      };
      const response = await appController.healthCheck();
      expect(response).toEqual(expectedResponse);
    });
  });
});
