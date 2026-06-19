import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @Column()
    precio!: number;

    @Column()
    descripcion!: string;

    @Column()
    cantidad!: number;

    @Column()
    imagen!: string;

    @Column()
    categoria!: string;

    @Column()
    stock!: number;
}
