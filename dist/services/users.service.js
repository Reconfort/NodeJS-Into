"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../modals/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async findAll(page, limit) {
        const [users, total] = await this.userRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return { users, total };
    }
    async findById(id) {
        return await this.userRepository.findOneBy({ id });
    }
    async findByName(name) {
        return await this.userRepository
            .createQueryBuilder('user')
            .where('LOWER(user.name) LIKE LOWER(:name)', { name: `%${name}%` })
            .getMany();
    }
    async findByEmail(email) {
        return await this.userRepository.findOneBy({ email });
    }
    async update(id, updatedData) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user)
            return null;
        // If password is being updated, hash it
        if (updatedData.password) {
            updatedData.password = await bcrypt_1.default.hash(updatedData.password, 10);
        }
        Object.assign(user, updatedData);
        return await this.userRepository.save(user);
    }
    async delete(id) {
        const result = await this.userRepository.delete(id);
        return result.affected ? result.affected > 0 : false;
    }
}
exports.UserService = UserService;
//# sourceMappingURL=users.service.js.map