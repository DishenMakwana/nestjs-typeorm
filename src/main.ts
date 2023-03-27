import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NODE_ENVIRONMENT } from './common/assets';
import * as morgan from 'morgan';
import { join } from 'path';
import helmet from 'helmet';
import * as basicAuth from 'express-basic-auth';
import { urlencoded, json } from 'express';
import validationOptions from './common/utils/validation-options';
import { HttpExceptionFilter } from './common/filters/bad-request.filter';

async function bootstrap() {
  // Logger
  const logger: Logger = new Logger(process.env.APP_NAME);

  // Create NestJS App
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env.NODE_ENV === NODE_ENVIRONMENT.DEVELOPMENT
        ? ['error', 'warn', 'debug', 'verbose', 'log']
        : ['error', 'warn', 'debug', 'verbose'],
  });

  // Get Config Service for env variables
  const configService = app.get(ConfigService);

  // log requests
  if (configService.get<string>('NODE_ENV') === NODE_ENVIRONMENT.DEVELOPMENT) {
    app.use(morgan('dev'));
  }

  // Url Prefix
  app.setGlobalPrefix('api');

  // Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  // setup static assets
  app.useStaticAssets(join(__dirname, '..', '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', '..', 'public', 'pages'));

  // setup template engine
  app.setViewEngine('hbs');

  // setup global pipes, filters and interceptors
  const reflector = app.get(Reflector);
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalFilters(new HttpExceptionFilter(reflector));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  // setup swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('NestJS API With TypeORM description')
    // .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    // .addServer('http://localhost:5001')
    // .addServer('https://api.nestjs.com')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'access_token',
    })
    .setExternalDoc('Postman Collection', '/api/docs-json')
    .build();

  const docPath = '/api/docs';

  if (configService.get<string>('NODE_ENV') === NODE_ENVIRONMENT.PRODUCTION) {
    const user = {};
    user[configService.get<string>('SWAGGER_USER')] =
      configService.get<string>('SWAGGER_PASSWORD');

    app.use(
      docPath,
      basicAuth({
        challenge: true,
        users: user,
      }),
    );
  }

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(docPath, app, document);

  // setup body parser
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // enable helmet
  app.use(helmet());

  // enable cors
  const enableCors = configService.get<boolean>('ENABLE_CORS');
  if (enableCors) {
    app.enableCors();
  }

  await app.listen(configService.get<number>('PORT') || 5000, '0.0.0.0');

  logger.debug(`Application is running on: ${await app.getUrl()}`);
  logger.debug(
    `Swagger docs: ${configService.get<string>('API_BASE_URL')}${docPath}`,
  );
}

bootstrap();
