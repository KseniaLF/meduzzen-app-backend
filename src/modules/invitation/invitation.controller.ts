import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { EditPermissionGuard } from './guard/edit-permission.guard';
import { ReadPermissionGuard } from './guard/read-permission.guard';

@Controller('invitation')
@UseGuards(JwtAuthGuard)
export class InvitationController {
  constructor(private readonly invitationService: InvitationService) {}

  @Get('forMe')
  getInvitation(@Request() req) {
    return this.invitationService.getInvitationsForMe(req.user.email);
  }

  @Get('all')
  getAllInvitation() {
    return this.invitationService.getAllInvitations();
  }

  @Get('my')
  getAllMy(@Request() req) {
    return this.invitationService.getAllMyInvitations(req.user.email);
  }

  // I CAN invite myself ❌❗
  @Post('send')
  async sendInvitation(@Request() req) {
    return await this.invitationService.sendInvitation(
      '123drrdm@mmm3.com',
      '0c08e790-0d10-42b0-9dd2-e89bf1bb227f',
      req.user.email,
    );
  }

  @Get(':id')
  @UseGuards(ReadPermissionGuard)
  getInvitationById(@Param('id') id: string) {
    return this.invitationService.getInvitationById(id);
  }

  @Delete(':id')
  @UseGuards(EditPermissionGuard)
  deleteInvitation(@Param('id') id: string) {
    return this.invitationService.deleteInvitation(id);
  }
}
