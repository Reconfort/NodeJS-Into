import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export type UserRole = 'user' | 'admin';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, nullable: true, unique: true })
  email!: string;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role!: UserRole;

  @Column({ length: 255 })
  password!: string;

  @Column({ default: false })    
  isVerified!: boolean;

  @Column({ default: true })
  isActive!: boolean;

  // New file upload fields
  @Column({ nullable: true })
  profileImage?: string; // Cloudinary URL

  @Column({ nullable: true })
  cvFile?: string; // Cloudinary URL

  @Column({ nullable: true })
  introVideo?: string; // Cloudinary URL

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}