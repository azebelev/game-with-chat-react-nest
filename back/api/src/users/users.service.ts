import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserOptions, FindUserParams } from '../types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async findUser(
    params: FindUserParams,
    options?: FindUserOptions,
  ): Promise<User> {
    const selections: (keyof User)[] = ['email', 'name', 'id'];
    const selectionsWithPassword: (keyof User)[] = [...selections, 'password'];
    return this.userRepo.findOne({
      select: options?.selectAll ? selectionsWithPassword : selections,
      where: { ...params },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    try {
      await this.userRepo.save(user);
    } catch (error) {
      console.log(error);
    }
    const { name, email } = user;
    return { name, email };
  }

  findAll() {
    try {
      return this.userRepo.find();
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    try {
      return this.userRepo.findOne({ where: { id } });
    } catch (error) {
      console.log(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    try {
      return this.userRepo.update(id, updateUserDto);
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: number) {
    try {
      return await this.userRepo.delete(id);
    } catch (error) {
      console.log(error);
    }
  }
}
