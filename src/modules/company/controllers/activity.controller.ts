import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Get,
  Request,
  Param,
} from '@nestjs/common';
import { CompanyService } from '../company.service';

import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@Controller('company/activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('invitation/forMe')
  getInvitation(@Request() req) {
    return this.companyService.getInvitationsForMe(req.user.email);
  }

  @Post('invitation/send')
  async sendInvitation() {
    return await this.companyService.sendInvitation(
      '123drrdm@mmm2.com',
      '2a44591b-c017-4993-92e2-2a4119c6f1af',
    );
  }

  @Delete('invitation/:id')
  deleteInvitation(@Param('id') id: string) {
    return this.companyService.deleteInvitation(id);
  }
}
