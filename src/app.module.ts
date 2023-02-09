import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PlantingModule } from "./planting/planting.module";
import { PricesModule } from "./prices/prices.module";
import { GeneratorModule } from "./generator/generator.module";
import { CalcModule } from "./calc/calc.module";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URL),
    PlantingModule,
    PricesModule,
    GeneratorModule,
    CalcModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
