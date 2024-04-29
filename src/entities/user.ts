import { Column, Entity } from 'typeorm';
import { AppEntity } from './utils/Entity';
import { IsEmail, Matches } from 'class-validator';

@Entity()
export class User extends AppEntity {
  @Column({ unique: true })
  username!: string;
  @Column({ unique: true })
  @IsEmail()
  @Matches(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)
  email!: string;
  @Column()
  password!: string;
  @Column({ default: '' })
  bio!: string;
  @Column({ default: '' })
  image!: string;
  @Column({ default: false })
  following!: boolean;
}
