import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { AppEntity } from './utils/Entity';
import { Article } from './article.entity';

@Entity()
export class Tag extends AppEntity {
  @Column({ unique: true })
  name!: string;
  @ManyToMany(() => Article, (article) => article.tagList)
  @JoinTable()
  articles!: Article[];
}
