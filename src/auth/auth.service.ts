import { BadRequestException, Injectable } from '@nestjs/common'
import { SignUpDto } from './dtos'
import { Connection } from 'typeorm'
import { User } from 'src/entity'
import { CipherService } from './ciphers/cipher.service'

@Injectable()
export class AuthService {
  constructor(private connection: Connection, private cipherService: CipherService) {}

  async signUp(dto: SignUpDto): Promise<Partial<User>> {
    const manager = this.connection.manager
    const existingUser = await manager.findOne(User, { email: dto.email })

    if (existingUser) {
      throw new BadRequestException('User already existed')
    }

    const userDto: Partial<User> = {
      email: dto.email.trim().toLowerCase(),
      password: await this.cipherService.cipher(dto.password),
    }

    const userEntity = await manager.save(User, userDto)
    const { password, ...rest } = await manager.findOne(User, { id: userEntity.id })

    return { ...rest }
  }

  async signIn(dto: SignUpDto): Promise<any> {
    const manager = this.connection.manager
    const encryptedPassword = await this.cipherService.cipher(dto.password)

    const userEntity = await manager.findOne(User, { email: dto.email, password: encryptedPassword })

    if (!userEntity) {
      throw new BadRequestException('Your account does not exist')
    }

    const { password, email, ...rest } = userEntity
    const base64encodedData = Buffer.from(dto.email + ':' + dto.password).toString('base64')

    const lastActivity = new Date(Date.now())
    await manager.update(User, { id: userEntity.id }, { lastActivity })

    return { ...rest, lastActivity, token: base64encodedData }
  }
}
