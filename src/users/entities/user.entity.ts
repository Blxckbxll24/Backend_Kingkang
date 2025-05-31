import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Order } from '../../orders/entities/order.entity';
import { Cart } from '../../carts/entities/cart.entity'; // Import Cart entity

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

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];
    
    @Column({ nullable: true })
    cartId?: number;
    // agregar relaciones de carrito 
    @OneToMany(() => Cart, (cart) => cart.user)
     carts: Cart[];

 // Agregar campo para relacionar con el carrito

     
}
