import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as express from 'express'
import * as helmet from 'helmet'
import * as compression from 'compression'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          'content-src': ["'self'", 'https:', 'data:'],
          'default-src': ["'self'"],
          'base-uri': ["'self'"],
          'block-all-mixed-content': [],
          'font-src': ["'self'", 'https:', 'data:'],
          'img-src': ["'self'", 'data:'],
          'object-src': ["'none'"],
          'script-src': ["'self'"],
          'script-src-attr': ["'none'"],
          'style-src': ["'self'", 'https:', "'unsafe-inline'"],
          'upgrade-insecure-requests': [],
          'frame-ancestors': ["'self'", configService.get<string>('FE_DOMAIN', '')],
        },
      },
    }),
  )

  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(compression())

  await app.listen(configService.get<number>('PORT'))
}

bootstrap()
  .then(() => console.log('Application started'))
  .catch(console.error)
