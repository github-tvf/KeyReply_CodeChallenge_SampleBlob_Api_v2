import { IsString } from 'class-validator'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseColumns } from './base-columns'

@Entity()
export class User extends BaseColumns {
  @Column({ nullable: true })
  @IsString()
  public email: string

  @Column({ nullable: true, select: false })
  @IsString()
  public password: string
}
