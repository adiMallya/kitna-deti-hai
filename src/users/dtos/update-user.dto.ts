import {IsEmail, IsStrongPassword, IsOptional} from 'class-validator';

export class UpdateUserDto{
    @IsEmail()
    @IsOptional()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minNumbers: 1,
        minUppercase: 1
    })
    @IsOptional()
    password: string;
}