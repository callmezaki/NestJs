import { Injectable, UseGuards } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";
import { User, Prisma } from "@prisma/client";
import { UserData } from "./user.dto";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import axios from "axios";

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
  async validateUser(data: any) {
    const { userId } = data;

    const user = await this.prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    return user ? user : null;
  }

  async getAccessToken()  {
    const TOKEN_ENDPOINT = "https://api.intra.42.fr/oauth/token";

    try {
      const response = await axios.post(TOKEN_ENDPOINT, {
        client_id: process.env.UID,
        client_secret: process.env.SECRET,
        grant_type: "client_credentials",
      });

      const { access_token } = response.data;
      console.log("Access Token:", access_token);
      return access_token;
    } catch (error) {
      console.error("Error retrieving access token:", error.response.data);
    }
  }

  async get_intra_user(Token : string) {
    const apiUrl = "https://api.intra.42.fr/v2/users/zait-sli"
    
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${Token}`,
      },
    }) .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      // Handle any errors
      console.error(error);
      return "did not work"
    })
  }
}
