import { Injectable, UseGuards } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { UserData } from './user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }
  async addUser(userData: UserData) {
    const exist = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (!exist) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userData.password, salt);
      await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hash,
        },
      });
      return 'User created';
    } else {
      return 'user exist';
    }
  }
  generateToken(userId: number): string {
    const token = jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1d' });
    return token;
  }

  async login(userData: UserData) {

    const user = await this.prisma.user.findUnique({ where: { email :userData.email } });
    if (user){
        const valid = await bcrypt.compare(userData.password, user.password)
        if (valid)
            return this.generateToken(user.id)
    }
    else { return "invalid creds" }
  }
  async validateUser(data: any) {
    const { userId } = data;

    const user = await this.prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    return user ? user : null;
  }
}
