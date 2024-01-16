import {
  Controller,
  Post,
  Delete,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { CompanyService } from '../company.service';

import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';

@Controller('company/activity')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(private readonly companyService: CompanyService) {}

  @Delete('invitation/d')
  deleteInvitation() {
    return this.companyService.deleteInvitation('123drrdm@mmm.com');
  }

  @Get('invitation/forMe')
  getInvitation(@Request() req) {
    return this.companyService.getInvitationsForMe(req.user.email);
  }

  @Post('invitation/send')
  sendInvitation() {
    return this.companyService.sendInvitation('123drrdm@mmm.com', '20');
  }
}
