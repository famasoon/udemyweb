import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
  ) { }

  @Get()
  async all(): Promise<Role[]> {
    return this.roleService.all();
  }

  @Post()
  async create(@Body() body): Promise<Role> {
    return this.roleService.create(body)
  }

  @Get(':id')
  async get(@Param("id") id: number): Promise<Role> {
    console.log({ id })
    return this.roleService.findOne({ id })
  }

  @Put(':id')
  async update(@Param("id") id: number, @Body('name') name: string) {
    await this.roleService.update(id, name)
    return this.roleService.findOne({ id })
  }

  @Delete(':id')
  async delete(@Param("id") id: number) {
    return this.roleService.delete(id)
  }
}
