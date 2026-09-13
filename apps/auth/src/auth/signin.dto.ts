import { getSigninSchema } from '@power-paint/contracts'
import { createZodDto } from 'nestjs-zod'

export class SigninDto extends createZodDto(getSigninSchema()) {}
