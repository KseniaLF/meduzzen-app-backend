import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Request,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { EditPermissionGuard } from './guard/edit-permission.guard';

@Controller('request')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async sendInvitation(
    @Body() sendRequestDto: CreateRequestDto,
    @Request() req,
  ) {
    return await this.requestService.sendRequest({
      ...sendRequestDto,
      userEmail: req.user.email,
    });
  }

  @Get()
  findMy(@Request() req) {
    return this.requestService.findAllMy(req.user.email);
  }

  @Get('all')
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(EditPermissionGuard)
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.updateMessage(id, updateRequestDto);
  }

  @Delete(':id')
  @UseGuards(EditPermissionGuard)
  removeInvitation(@Param('id') id: string) {
    return this.requestService.removeRequest(id);
  }
}
