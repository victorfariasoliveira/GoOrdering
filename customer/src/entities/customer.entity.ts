import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    cpf: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    cep: string;

    @Column()
    logradouro: string;

    @Column()
    district: string;

    @Column()
    uf: string
}