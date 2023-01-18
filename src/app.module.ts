import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { PricesModule } from './prices/prices.module';

const { DB_URL } = process.env;

@Module({
  imports: [MongooseModule.forRoot(DB_URL), PricesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
