import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'
import { SignUpDto } from './dtos'
import { AuthGuard } from './guards'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }

  @Post('sign-in')
  @UseGuards(AuthGuard)
  async signIn(@Body() signInpDto: SignUpDto) {
    return this.authService.signIn(signInpDto)
  }
}
