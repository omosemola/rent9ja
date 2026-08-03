import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check & API info' })
  getHealth() {
    return {
      status: 'online',
      name: 'RentNaija API',
      version: '1.0.0',
      swaggerDocs: 'http://localhost:3001/api/docs',
      timestamp: new Date().toISOString(),
    };
  }
}
