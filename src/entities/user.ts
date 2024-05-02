import { IsEmail, Matches } from 'class-validator';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import { Article } from './article.entity';
import { AppEntity } from './utils/Entity';

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
  @Column('simple-array', { nullable: true })
  follow!: number[];
  @ManyToMany(() => Article, (article) => article.favoritedBy)
  favorites!: Article[];
  @OneToMany(() => Article, (article) => article.author)
  articles!: Article[];
}
