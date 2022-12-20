import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";

const { DB_URL } = process.env;

@Module({
  imports: [MongooseModule.forRoot(DB_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
