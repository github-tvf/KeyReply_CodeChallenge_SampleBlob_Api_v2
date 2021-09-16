import { Injectable } from '@nestjs/common'
import { User } from 'src/entity'
import { Connection } from 'typeorm'

@Injectable()
export class UserService {
  constructor(private connection: Connection) {}
  async findUser(email: string, password: string): Promise<Partial<User>> {
    return this.connection.manager.findOne(User, { email, password })
  }
}
