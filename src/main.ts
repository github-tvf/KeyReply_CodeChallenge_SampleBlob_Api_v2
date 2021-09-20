import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import * as express from 'express'
import * as helmet from 'helmet'
import * as compression from 'compression'
import * as morgan from 'morgan'
import * as fs from 'fs'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(ConfigService)

  app.enableCors()
  app.use(morgan('combined', { stream: fs.createWriteStream('server.log', { flags: 'a' }) }))
  app.use(morgan('dev'))
  app.use(express.json({ limit: '50mb' }))
  app.use(express.urlencoded({ limit: '50mb', extended: true }))
  app.use(compression())

  process.on('uncaughtException', (err) => {
    console.log(err)
  })

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(configService.get<number>('PORT'))
}

bootstrap()
  .then(() => console.log('Application started'))
  .catch(console.error)
