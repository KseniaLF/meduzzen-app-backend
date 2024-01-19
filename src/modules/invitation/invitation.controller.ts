import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { InvitationService } from './invitation.service';
import { JwtAuthGuard } from 'src/user/guards/jwt-auth.guard';
import { EditPermissionGuard } from './guard/edit-permission.guard';
import { ReadPermissionGuard } from './guard/read-permission.guard';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationValidationGuard } from './guard/invitation-validation.guard';

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
  @UsePipes(new ValidationPipe())
  async sendInvitation(
    @Body() sendInviteDto: CreateInvitationDto,
    @Request() req,
  ) {
    return await this.invitationService.sendInvitation({
      ...sendInviteDto,
      ownerEmail: req.user.email,
    });
  }

  // ---------- USER ----------------
  @Post('/accept-invite/:inviteId')
  @UseGuards(InvitationValidationGuard)
  acceptInvitation(@Param('inviteId') inviteId: string) {
    return this.invitationService.acceptInvitation(inviteId);
  }

  @Post('/reject-invite/:inviteId')
  @UseGuards(InvitationValidationGuard)
  rejectInvitation(@Param('inviteId') inviteId: string) {
    return this.invitationService.rejectInvitation(inviteId);
  }

  @Get('user-activity')
  getUsersActivity() {
    return this.invitationService.getUsersActivity();
  }

  // -------------------------
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
