"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransporter = createTransporter;
const nodemailer_1 = __importDefault(require("nodemailer"));
async function createTransporter() {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Missing email credentials');
    }
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    try {
        await transporter.verify();
    }
    catch (error) {
        console.error('Email configuration nodemailer error:', error);
        throw new Error('Failed to connect to email service. Please check your email cnfigurations.');
    }
    return transporter;
}
//# sourceMappingURL=mail-transport.js.map