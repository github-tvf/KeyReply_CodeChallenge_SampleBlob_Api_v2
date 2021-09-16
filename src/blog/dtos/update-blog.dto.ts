import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class BlogDto {
  @IsOptional()
  @IsString()
  public title: string

  @IsOptional()
  @IsString()
  public content: string
}
