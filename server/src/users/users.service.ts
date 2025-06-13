import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    // Check if user with this email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.prisma.user.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        photos: true,
        interests: true,
        subscription: true,
        socialAccounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        photos: true,
        interests: true,
        subscription: true,
        socialAccounts: true,
      },
    });
  }

  async findBySocialProvider(provider: string, providerId: string) {
    const socialAccount = await this.prisma.socialAccount.findUnique({
      where: {
        provider_providerId: {
          provider,
          providerId,
        },
      },
      include: {
        user: true,
      },
    });

    return socialAccount?.user;
  }

  async update(id: string, data: any) {
    const user = await this.findOne(id);

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }

  async linkSocialAccount(userId: string, socialData: any) {
    return this.prisma.socialAccount.create({
      data: {
        ...socialData,
        user: {
          connect: { id: userId },
        },
      },
    });
  }
}
