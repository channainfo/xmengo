import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async register(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.usersService.create({
      ...userData,
      password: hashedPassword,
    });
    
    const { password, ...result } = user;
    return result;
  }

  async validateOAuthLogin(profile: any, provider: string) {
    try {
      // Check if user exists with this social account
      let user = await this.usersService.findBySocialProvider(provider, profile.id);
      
      if (!user) {
        // Check if user exists with this email
        if (profile.email) {
          user = await this.usersService.findByEmail(profile.email);
        }
        
        // If user doesn't exist, create a new one
        if (!user) {
          user = await this.usersService.create({
            email: profile.email || `${provider}_${profile.id}@fmengo.com`,
            name: profile.name || `${provider} User`,
            isVerified: true,
            // Add other required fields with default values
            dateOfBirth: new Date('2000-01-01'), // Default date
            gender: 'not_specified',
            interestedIn: ['not_specified'],
          });
        }
        
        // Link social account to user
        await this.usersService.linkSocialAccount(user.id, {
          provider,
          providerId: profile.id,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
        });
      }
      
      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Failed to authenticate with social provider');
    }
  }
}
