import { BadRequestException, Injectable } from '@nestjs/common'
import { Blog, User } from 'src/entity'
import { Connection } from 'typeorm'
import { BlogDetails, BlogDto } from './dtos'

@Injectable()
export class BlogService {
  constructor(private connection: Connection) {}
  async getAllBlogs(take: number, page: number): Promise<BlogDetails[]> {
    const manager = this.connection.manager

    const blogs = await manager.find(Blog, { take, skip: take * (page - 1) })
    const blogDetais = blogs.map((blog) => {
      return {
        id: blog.id,
        title: blog.title,
        content: blog.content,
        author: blog.user.email,
        imageUrl: this.generateImageUrl(blog.blobName),
      }
    })

    return blogDetais
  }

  async createBlog(creatDto: BlogDto, user: User): Promise<Blog> {
    const manager = this.connection.manager
    const userEntity = await manager.findOne(User, { id: user.id })

    if (!userEntity) {
      throw new BadRequestException('Your account does not exist')
    }

    const payload = new Blog()
    payload.title = creatDto.title
    payload.content = creatDto.content
    payload.user = userEntity

    const blogEntity = await manager.save(Blog, payload)
    delete blogEntity.user
    return blogEntity
  }

  async getBlog(blogId: string): Promise<Blog> {
    return this.connection.manager.findOne(Blog, { id: blogId })
  }

  async updateBlog(blogId: string, user: User, updateDto: BlogDto): Promise<Blog> {
    const manager = this.connection.manager

    const validUserBlogs = await this.isBlogBelongsToUser(blogId, user.id)

    if (!validUserBlogs) {
      throw new BadRequestException('The blog is not belongs to the user')
    }

    await manager.update(Blog, { id: blogId }, { ...updateDto })
    return manager.findOne(Blog, { id: blogId })
  }

  async deleteBlog(blogId: string, user: User): Promise<boolean> {
    const validUserBlogs = await this.isBlogBelongsToUser(blogId, user.id)

    if (!validUserBlogs) {
      throw new BadRequestException('The blog is not belongs to the user')
    }

    await this.connection.manager.delete(Blog, { id: blogId })
    return true
  }

  async uploadFile(blogId: string, user: User, file: Express.Multer.File): Promise<any> {
    const manager = this.connection.manager
    const { originalname, filename, mimetype } = file

    const validUserBlogs = await this.isBlogBelongsToUser(blogId, user.id)

    if (!validUserBlogs) {
      throw new BadRequestException('The blog is not belongs to the user')
    }

    await manager.update(Blog, { id: blogId }, { blobName: filename, originalName: originalname, mimeType: mimetype })
  }

  async isBlogBelongsToUser(blogId: string, userId: string): Promise<Blog | undefined> {
    return this.connection.manager
      .createQueryBuilder(Blog, 'blog')
      .leftJoinAndSelect('blog.user', 'user')
      .where('blog.id = :blogId', { blogId })
      .andWhere('user.id = :userId', { userId })
      .getOne()
  }

  generateImageUrl(blobName: string): string {
    return `./upload/${blobName}`
  }
}
