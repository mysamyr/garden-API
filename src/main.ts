import * as dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from "./app.module";

const { PORT = 3000 } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
}
bootstrap();
