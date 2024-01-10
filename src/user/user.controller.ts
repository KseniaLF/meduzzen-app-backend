import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities';
import { PaginationOptions, PaginationResult } from 'src/common/interfaces';
import { SignInDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto): Promise<string> {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  signIn(@Body() signInDto: SignInDto): Promise<string> {
    return this.userService.signIn(signInDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return console.log(req.user);
  }

  @Get()
  findAll(@Query() query: PaginationOptions): Promise<PaginationResult<User>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<string> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<string> {
    return this.userService.remove(id);
  }
}
