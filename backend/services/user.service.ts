import { UserRepository, User, UserInfo } from '../repositories/user.repository';

export class UserService {
  private userRepository = new UserRepository();

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findById(userId);
    const info = await this.userRepository.findInfoById(userId);
    
    if (!user) throw new Error('User not found');
    
    return {
      ...user,
      info
    };
  }

  async updateProfile(userId: string, data: { fullName?: string; info?: Partial<UserInfo> }) {
    if (data.fullName) {
      await this.userRepository.update(userId, { fullName: data.fullName });
    }
    
    if (data.info) {
      await this.userRepository.updateInfo(userId, data.info);
    }
    
    return this.getUserProfile(userId);
  }

  async createUserProfile(userId: string, email: string, fullName: string) {
    await this.userRepository.create(userId, { email, fullName });
  }
}
