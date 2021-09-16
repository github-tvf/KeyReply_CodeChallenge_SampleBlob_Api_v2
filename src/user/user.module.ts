import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CipherService } from 'src/auth/ciphers/cipher.service'

@Module({
  providers: [UserService, CipherService],
  controllers: [UserController],
  exports: [UserService, CipherService],
})
export class UserModule {}
