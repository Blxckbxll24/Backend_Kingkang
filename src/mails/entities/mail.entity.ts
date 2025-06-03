import { User } from "../../users/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('mails')
export class Mail {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    phone: string;
    @Column()
    message: string;
      @ManyToOne(() => User, (user) => user.orders, { eager: true })
      @JoinColumn({ name: 'userId' })
      user: User;
    @Column()
    userId: number;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
    @DeleteDateColumn({ nullable: true })
    deletedAt?: Date;
}
