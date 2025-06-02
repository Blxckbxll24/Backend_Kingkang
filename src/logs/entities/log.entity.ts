
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  action: string;

  @Column('text', { nullable: true })
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
