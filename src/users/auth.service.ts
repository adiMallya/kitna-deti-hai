import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt} from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async signup(email: string, password: string){
        // check user exists
        const users = await this.usersService.find(email);
        if(users.length){
            throw new BadRequestException('Email already in use.');
        }  
        // encrypt user password
        const salt = randomBytes(8).toString('hex');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = `${hash.toString('hex')}.${salt}`;
        // create and save user
        const user = await this.usersService.create(email, result);
        // return user
        return user;
    }

    async login(email: string, password: string){
        // get encrypted password from db
        const [user] = await this.usersService.find(email);
        if(!user){
            throw new NotFoundException('User not found');
        } 

        const [hash, salt] = user.password.split('.');
        //decryption
        const result = (await scrypt(password, salt, 32)) as Buffer;
        if(result.toString('hex') !== hash){
            throw new BadRequestException('Login Failed. Please check your password.');
        }
        //return user with cookie
        return user;
    }
}
