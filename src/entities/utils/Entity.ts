import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class AppEntity {
  @PrimaryGeneratedColumn('identity')
  id!: number;
  @UpdateDateColumn()
  updatedAt!: Date;
  @CreateDateColumn()
  createdAt!: Date;
}
