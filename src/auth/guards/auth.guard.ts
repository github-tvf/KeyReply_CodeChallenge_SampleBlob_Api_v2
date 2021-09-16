import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { User } from 'src/entity'
import { UserService } from 'src/user'
import { Connection } from 'typeorm'
import { CipherService } from '../ciphers/cipher.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private cipherService: CipherService, private userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const b64auth = (request?.headers?.authorization || '').split(' ')[1] || ''
    if (!b64auth) {
      throw new UnauthorizedException('Your account does not exist')
    }

    const [email, password] = Buffer.from(b64auth, 'base64').toString().split(':')
    const encryptedPassword = await this.cipherService.cipher(password)
    const userEntity = await this.userService.findUser(email, encryptedPassword)

    if (!userEntity) {
      throw new UnauthorizedException('Your account does not exist')
    }

    Object.defineProperty(request, 'user', {
      value: userEntity,
      writable: true,
    })

    return true
  }
}
