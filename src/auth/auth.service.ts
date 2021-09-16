import { BadRequestException, Injectable } from '@nestjs/common'
import { SignUpDto } from './dtos'
import { Connection } from 'typeorm'
import { User } from 'src/entity'
import { CipherService } from './ciphers/cipher.service'

@Injectable()
export class AuthService {
  constructor(private connection: Connection, private cipherService: CipherService) {}

  async signUp(dto: SignUpDto): Promise<any> {
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
    const { password, email, ...rest } = await manager.findOne(User, { id: userEntity.id })

    const base64encodedData = Buffer.from(email + ':' + password).toString('base64')
    return { ...rest, token: base64encodedData }
  }

  async signIn(dto: SignUpDto): Promise<Partial<User>> {
    const manager = this.connection.manager
    const encryptedPassword = await this.cipherService.cipher(dto.password)

    const userEntity = await manager.findOne(User, { email: dto.email, password: encryptedPassword })

    if (!userEntity) {
      throw new BadRequestException('Your account does not exist')
    }

    const { password, ...rest } = userEntity

    return rest
  }
}
