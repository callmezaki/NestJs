import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { userController } from "./user.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UserService } from "./user.service";
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { FortyTwoStrategy } from './42auth/intra.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: '42' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AppController, userController],
  providers: [AppService, UserService, JwtStrategy,FortyTwoStrategy],
})
export class AppModule {}
