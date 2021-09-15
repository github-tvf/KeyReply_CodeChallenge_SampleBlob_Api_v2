import { IsUUID, IsDate } from 'class-validator'
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

export abstract class BaseColumns {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  public id: string

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  @CreateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  public createdAt: Date

  @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  @IsDate()
  public updatedAt: Date
}
