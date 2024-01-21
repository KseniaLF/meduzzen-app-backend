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

@Controller('request')
@UseGuards(JwtAuthGuard)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post('send')
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

  // @Get()
  // findAldl(@Request() req) {
  //   console.log(req.user);
  //   return this.requestService.gggg();
  // }

  @Get()
  findAll() {
    return this.requestService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(+id);
  }
}
