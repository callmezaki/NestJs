import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { userController } from './user.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user.service';


import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [PrismaModule, 
    JwtModule.register({
    secret: 'your-secret-key',
    signOptions: { expiresIn: '1d' },
  }),],
  controllers: [AppController, userController],
  providers: [AppService, UserService, JwtStrategy],
})
export class AppModule {}
