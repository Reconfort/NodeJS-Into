"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVerfiyEmailAttribute1748327634698 = void 0;
const typeorm_1 = require("typeorm");
class AddVerfiyEmailAttribute1748327634698 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'isVerified',
            type: 'boolean',
            isNullable: false,
            default: false,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('users', 'isVerified');
    }
}
exports.AddVerfiyEmailAttribute1748327634698 = AddVerfiyEmailAttribute1748327634698;
//# sourceMappingURL=1748327634698-add-verfiy-email-attribute.js.map