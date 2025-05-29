import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: false })
    username: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ default: false })
    isActive: boolean;

    @ManyToOne(() => Role, (role) => role.users, {
        eager: true,
        onDelete: 'CASCADE', 
    })
    @JoinColumn({ name: 'roleId' })
    role: Role;


    @Column({ nullable: true })
    roleId?: number;

}
