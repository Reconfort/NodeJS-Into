import { User } from '../entities/User';
import { UserRepository } from '../repositories/UserRepository';

export class UserService {
  async findAll(): Promise<User[]> {
    return UserRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return UserRepository.findOneById(id);
  }

  async findByName(name: string): Promise<User[]> {
    return UserRepository.findByName(name);
  }

  async create(userData: Partial<User>): Promise<User> {
    return UserRepository.createUser(userData);
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    return UserRepository.updateUser(id, userData);
  }

  async delete(id: number): Promise<boolean> {
    return UserRepository.deleteUser(id);
  }
}