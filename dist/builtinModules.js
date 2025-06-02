"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const greeting_1 = __importDefault(require("./greeting"));
console.log('Current File:', path_1.default.basename(__filename));
console.log('Directory:', path_1.default.basename(__dirname));
console.log((0, greeting_1.default)('Klab Team'));
//# sourceMappingURL=builtinModules.js.map