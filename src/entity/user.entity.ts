import { IsDate, IsString } from 'class-validator'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { BaseColumns } from './base-columns'
import { Blog } from './blog.entity'

@Entity()
export class User extends BaseColumns {
  @Column({ nullable: true })
  @IsString()
  public email: string

  @Column({ nullable: true, select: false })
  @IsString()
  public password: string

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  @IsDate()
  public lastActivity: Date

  @OneToMany(() => Blog, (blog) => blog.user)
  public blogs: Blog[]
}
