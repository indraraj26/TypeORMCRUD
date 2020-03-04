import { Entity, Column, Unique } from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Base as BaseEntity } from './BaseEntity';

@Entity()
@Unique(['name'])
export class User extends BaseEntity {
    @Column()
    @Length(4, 20)
    name: string;

    @Column()
    @IsNotEmpty()
    address: string;

    @Column()
    @IsNotEmpty()
    mobile_no: string;

    @Column()
    hobbies: string;
}
