import { Injectable, UseGuards } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { User, Prisma } from "@prisma/client";
import { UserData } from "./user.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import axios from "axios";
import passport from "passport";

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
          username: userData.username,
          email: userData.email,
          password: hash,
          profile : {
            create : {
              firstName : userData.firstName,
              lastName : userData.lastName,
              email : userData.email,
              username : userData.username,
            }
        }
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
    const user = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (user) {
      const valid = await bcrypt.compare(userData.password, user.password);
      if (valid) return this.generateToken(user.id);
    } else {
      return "invalid creds";
    }
  }

  async intraJWT(email : string){
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return this.generateToken(user.id)
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

  async getProfile( id : string) {
    const profile =  await this.prisma.profile.findUnique({
      where: {
        userId : +id,
      }
    })
    const {userId , ...ret} = profile;
    return ret;
  }

  async validateIntraUser(user : any) : Promise<any> {
    
    const exist = await this.prisma.user.findUnique({
      where: { email: user.email },
    });
    if (!exist)
    {
      await this.prisma.user.create({
        data: {
          username: user.username,
          email: user.email,
          id42: +user.fortyTwoId,
          password: "hhhh",
          profile : {
              create : {
                firstName : user.firstName,
                lastName : user.lastName,
                email : user.email,
                username : user.username,
              }
          }
        },
      });
    }
    return user;
  }
}
