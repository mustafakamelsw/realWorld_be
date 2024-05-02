import {
  BeforeRemove,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AppEntity } from './utils/Entity';
import { User } from './user';
import { Tag } from './tag.entity';
import { AppDataSource } from '../../ormconfig';
import { Comment } from './comment.entity';

@Entity()
export class Article extends AppEntity {
  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  body!: string;

  @ManyToMany(() => Tag, (tag) => tag.articles, {})
  @JoinTable()
  tagList!: Tag[];

  @ManyToOne(() => User, (user) => user.articles)
  @JoinColumn()
  author!: User;

  @ManyToMany(() => User, (user) => user.favorites)
  @JoinTable()
  favoritedBy!: User[];

  @OneToMany(() => Comment, (comment) => comment.article)
  comments!: Comment[];

  @BeforeRemove()
  async beforeRemove() {
    await Promise.all(
      this.tagList.map(async (tag) => {
        tag.articles = tag.articles.filter((article) => article.id !== this.id);
        const tagRepo = AppDataSource.getRepository(Tag);
        await tagRepo.save(tag);
      })
    );
  }
}
