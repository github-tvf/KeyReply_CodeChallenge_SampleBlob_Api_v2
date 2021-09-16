import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from 'src/entity'

export const CurrentUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: User }>()
  const user = request.user

  return data ? user && user[data as keyof User] : user
})
