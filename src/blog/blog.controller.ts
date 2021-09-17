import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { diskStorage } from 'multer'
import { AuthGuard } from 'src/auth/guards'
import { CurrentUser } from 'src/decorators/current-user.decorator'
import { Blog, User } from 'src/entity'
import { BlogService } from '.'
import { BlogDetails, BlogDto } from './dtos'

@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}
  @Get('all')
  async getAllBlogs(
    @Query('take', ParseIntPipe) take: number,
    @Query('page', ParseIntPipe) page: number,
  ): Promise<BlogDetails[]> {
    return this.blogService.getAllBlogs(take, page)
  }

  @Post('')
  @UseGuards(AuthGuard)
  async createBlog(@Body() creatDto: BlogDto, @CurrentUser() user: User): Promise<Blog> {
    return this.blogService.createBlog(creatDto, user)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getBlog(@Param('id', ParseUUIDPipe) blogId: string): Promise<Blog> {
    return this.blogService.getBlog(blogId)
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateBlog(
    @Param('id', ParseUUIDPipe) blogId: string,
    @CurrentUser() user: User,
    @Body() updateDto: BlogDto,
  ): Promise<Blog> {
    return this.blogService.updateBlog(blogId, user, updateDto)
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBlog(@Param('id', ParseUUIDPipe) blogId: string, @CurrentUser() user: User): Promise<boolean> {
    return this.blogService.deleteBlog(blogId, user)
  }

  @Post(':id/upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './upload',
        filename: function (req, file, callback) {
          callback(null, Date.now() + '-' + file.originalname)
        },
      }),
    }),
  )
  async uploadFile(
    @Param('id', ParseUUIDPipe) blogId: string,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.blogService.uploadFile(blogId, user, file)
  }

  @Get(':id/image')
  @UseGuards(AuthGuard)
  async getBlogImage(
    @Param('id', ParseUUIDPipe) blogId: string,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    return this.blogService.getBlogImage(blogId, user, res)
  }
}
