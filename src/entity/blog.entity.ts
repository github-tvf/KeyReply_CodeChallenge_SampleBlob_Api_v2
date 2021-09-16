import { IsString } from 'class-validator'
import { Column, Entity, ManyToOne } from 'typeorm'
import { User } from '.'
import { BaseColumns } from './base-columns'

@Entity()
export class Blog extends BaseColumns {
  @Column()
  @IsString()
  public title: string

  @Column()
  @IsString()
  public content: string

  @Column({ nullable: true })
  @IsString()
  public blobName: string

  @Column({ nullable: true })
  @IsString()
  public originalName: string

  @Column({ nullable: true })
  @IsString()
  public mimeType: string

  @ManyToOne(() => User, (user) => user.blogs, { onDelete: 'CASCADE' })
  public user: User
}
