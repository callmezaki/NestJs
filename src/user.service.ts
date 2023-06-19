import { Injectable, UseGuards } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { User, Prisma } from "@prisma/client";
import { UserData } from "./dtos/user.dto";
import { chPass } from "./dtos/pass.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import passport from "passport";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return await this.prisma.user.findMany();
  }
  async addUser(userData: UserData) {
    let exist = await this.prisma.user.findUnique({
      where: {
        email: userData.email,
      },
    });
    if (!exist) {
      exist = await this.prisma.user.findUnique({
        where: {
          username: userData.username,
        },
      });
    }
    if (!exist) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(userData.password, salt);
      await this.prisma.user.create({
        data: {
          username: userData.username,
          email: userData.email,
          password: hash,
          profile: {
            create: {
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              username: userData.username,
            },
          },
        },
      });
      return "User created";
    } else {
      return "user exist";
    }
  }
  generateToken(userId: number): string {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  }

  async login(userData: UserData) {
    let user: any;

    if (userData.email) {
      user = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
    } else if (userData.username) {
      user = await this.prisma.user.findUnique({
        where: { username: userData.username },
      });
    }
    if (user) {
      const valid = await bcrypt.compare(userData.password, user.password);
      if (valid) return this.generateToken(user.id);
      else {
        return "invalid password";
      }
    } else {
      return "invalid creds";
    }
  }

  async changePass(pass: chPass, id: string) {
    const user = await this.prisma.user.findUnique({ where: { id: +id } });
    const valid = await bcrypt.compare(pass.password, user.password);

    if (valid) {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(pass.newPassword, salt);
      await this.prisma.user.update({
        where: {
          id: +id,
        },
        data: {
          password: hash,
        },
      });
      return "Changed successfully";
    } else {
      return "invalid password";
    }
  }

  async intraJWT(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return this.generateToken(user.id);
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

  async getProfile(id: string) {
    console.log(isNaN(+id))
    if (!isNaN(+id)){
      const user = await this.prisma.user.findUnique({
        where: {
          id: +id,
        },
      })
      if (!user) return "Not found";
    }
    const profile = await this.prisma.profile.findUnique({
      where: {
        userId: +id,
      },
    });
    return profile;
  }

  async validateIntraUser(user: any): Promise<any> {
    const exist = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!exist) {
      await this.prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          id42: +user.fortyTwoId,
          password: "hhhh",
          profile: {
            create: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              username: user.username,
            },
          },
        },
      });
    }
    return user;
  }
}
