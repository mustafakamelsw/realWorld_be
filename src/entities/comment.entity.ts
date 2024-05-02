import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { AppEntity } from './utils/Entity';
import { Article } from './article.entity';
import { User } from './user';

@Entity()
export class Comment extends AppEntity {
  @Column({ nullable: false })
  body!: string;
  @ManyToOne(() => Article, (article) => article.comments, { cascade: true })
  @JoinColumn()
  article!: Article;
  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn()
  author!: User;
}
