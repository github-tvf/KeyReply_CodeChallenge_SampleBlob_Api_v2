import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string

  @IsString()
  @IsNotEmpty()
  public password: string
}
