import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './models/user.entity';
import * as bcrypt from 'bcrypt';
import { UserCreateDto } from './models/user-create.dto';
import { AuthGuard } from 'src/auth/auth/auth.guard';
import { UserUpdateDto } from './models/user-update.dto';
import { AuthService } from 'src/auth/auth.service';
import { Request } from 'express';
import { HasPermission } from 'src/permission/has-permission.decorator';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService, private authService: AuthService) {

  }

  @Get()
  @HasPermission('users')
  async all(@Query('page') page = 1) {
    return this.userService.paginate(page, ['role']);
  }

  @Post()
  @HasPermission('users')
  async create(@Body() body: UserCreateDto): Promise<User> {
    const password = await bcrypt.hash('1234', 12)
    const { role_id, ...data } = body

    return this.userService.create({
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: password,
      role_id: { id: role_id }
    })
  }

  @Put('info')
  @HasPermission('users')
  async updateInfo(@Req() request: Request, @Body() body: UserUpdateDto) {
    const id = await this.authService.userId(request)
    await this.userService.update(id, body)
    return this.userService.findOne({ id })
  }

  @Put('password')
  @HasPermission('users')
  async updatePassword(@Req() request: Request, @Body('password') password: string, @Body('password_confirm') password_confirm: string) {
    if (password !== password_confirm) {
      throw new BadRequestException('Passwords do not match!')
    }
    const id = await this.authService.userId(request)
    const hashedPassword = await bcrypt.hash(password, 12)
    await this.userService.update(id, { password: hashedPassword })
    return this.userService.findOne({ id })
  }

  @Get(':id')
  @HasPermission('users')
  async get(@Param("id") id: number): Promise<User> {
    console.log({ id })
    return this.userService.findOne({ id })
  }

  @Put(':id')
  @HasPermission('users')
  async update(@Param("id") id: number, @Body() body: UserUpdateDto) {
    const { role_id, ...data } = body
    await this.userService.update(id, {
      ...data,
      role: { id: role_id }
    })
    return this.userService.findOne({ id })
  }

  @Delete(':id')
  @HasPermission('users')
  async delete(@Param("id") id: number) {
    return this.userService.delete(id)
  }
}
