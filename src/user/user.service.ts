import { Injectable } from '@nestjs/common'
import { Blog, User } from 'src/entity'
import { Connection } from 'typeorm'

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}
  async findUser(email: string, password: string): Promise<Partial<User>> {
    return this.connection.manager.findOne(User, { email, password })
  }

  async getAllBlogsOfUser(user: User): Promise<Blog[]> {
    const blogs = await this.connection.manager
      .createQueryBuilder(Blog, 'blog')
      .leftJoinAndSelect('blog.user', 'user')
      .andWhere('user.id = :userId', { userId: user.id })
      .select()
      .getMany()

    blogs.forEach((blog) => delete blog.user)
    return blogs
  }
}
