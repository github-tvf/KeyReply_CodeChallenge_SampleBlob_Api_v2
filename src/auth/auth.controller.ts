import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SignUpDto } from './dtos'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('sign-in')
  async signIn(@Body() signInpDto: SignUpDto) {
    return this.authService.signIn(signInpDto)
  }
}
