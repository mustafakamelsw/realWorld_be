import { Column, Entity, JoinColumn, ManyToMany, OneToOne } from 'typeorm';
import { AppEntity } from './utils/Entity';
import { User } from './user';
import { Tag } from './tag.entity';

@Entity()
export class Article extends AppEntity {
  @Column({ nullable: false })
  title!: string;
  @Column({ nullable: false })
  description!: string;
  @Column({ nullable: false })
  body!: string;
  @ManyToMany(() => Tag, (tag) => tag.articles)
  tagList!: Tag[];
  @JoinColumn()
  author!: User;
}