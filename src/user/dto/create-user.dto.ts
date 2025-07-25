// src/user/dto/create-user.dto.ts

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
  readonly role: 'user' | 'admin' | 'manager';
}
