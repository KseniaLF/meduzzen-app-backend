import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@Controller('actions')
@UseGuards(JwtAuthGuard)
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  @Get('user-activity')
  getUsersActivity() {
    return this.actionsService.getUsersActivity();
  }

  //// - - - - - - - - - - -

  @Post()
  create(@Body() createActionDto: CreateActionDto) {
    return this.actionsService.create(createActionDto);
  }

  @Get()
  findAll() {
    return this.actionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.actionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActionDto: UpdateActionDto) {
    return this.actionsService.update(+id, updateActionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.actionsService.remove(id);
  }
}
