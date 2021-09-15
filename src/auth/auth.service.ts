import { BadRequestException, Injectable } from '@nestjs/common'
import { SignUpDto } from './dtos'
import { scrypt, createCipheriv } from 'crypto'
import { promisify } from 'util'
import { Connection } from 'typeorm'
import { User } from 'src/entities'

@Injectable()
export class AuthService {
  constructor(private connection: Connection) {}
  private async cipherPassword(password: string): Promise<string> {
    const iv = Buffer.from('VIETNAM-TECHVIFY')
    const salt = '$@$tNRnC5qdHZXBO$$*4'
    const keyLength = 32

    const key = (await promisify(scrypt)(password, salt, keyLength)) as Buffer
    const cipher = createCipheriv('aes-256-gcm', key, iv)

    const secret = 'TECHVIFY'
    const encryptedPassword = Buffer.concat([cipher.update(secret), cipher.final()]).toString('hex')

    return encryptedPassword
  }

  async signUp(dto: SignUpDto): Promise<Partial<User>> {
    const manager = this.connection.manager

    const encryptedPassword = await this.cipherPassword(dto.password)

    const userDto: Partial<User> = {
      email: dto.email,
      password: encryptedPassword,
    }

    const userEntity = await manager.save(User, userDto)

    const { password, ...rest } = await manager.findOne(User, { id: userEntity.id })
    return rest
  }

  async signIn(dto: SignUpDto): Promise<Partial<User>> {
    const manager = this.connection.manager

    const encryptedPassword = await this.cipherPassword(dto.password)

    const userEntity = await manager.findOne(User, { email: dto.email, password: encryptedPassword })

    if (!userEntity) {
      throw new BadRequestException('Your account does not exist')
    }

    const { password, ...rest } = userEntity

    return rest
  }
}
