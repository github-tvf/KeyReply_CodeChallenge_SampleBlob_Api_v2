import { IsEmail, IsString } from 'class-validator'

export class SignUpDto {
  @IsEmail()
  public email: string

  @IsString()
  public password: string
}
