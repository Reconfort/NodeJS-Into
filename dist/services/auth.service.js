"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../modals/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
class AuthService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
    }
    async create(userData) {
        if (!userData.password) {
            throw new Error("Password is required");
        }
        // Hash the password
        const hashedPassword = await bcrypt_1.default.hash(userData.password, 10);
        userData.password = hashedPassword;
        // Create and save user
        const user = this.userRepository.create(userData);
        return await this.userRepository.save(user);
    }
    async login(email, password) {
        const user = await this.userRepository.findOneBy({ email });
        if (!user)
            return null;
        const passwordMatches = await bcrypt_1.default.compare(password, user.password);
        if (!passwordMatches)
            return null;
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map