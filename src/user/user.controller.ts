import { Controller, Get, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/auth/guards'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { Blog, User } from 'src/entity'
import { UserService } from '.'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('')
  async getAll(): Promise<null> {
    return null
  }

  @Get(':id/blogs')
  @UseGuards(AuthGuard)
  async getAllBlogsOfUser(@CurrentUser() user: User): Promise<Blog[]> {
    return this.userService.getAllBlogsOfUser(user)
  }
}
