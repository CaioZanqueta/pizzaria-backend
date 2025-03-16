import prismaClient from '../../prisma'
import { hash } from 'bcryptjs'

interface IUserRequest {
  name: string
  email: string
  password: string
}

class CreateUserService {
  async execute({name, email, password}: IUserRequest) {
    // Verificar se ele enviou um email
    if (!email) {
      throw new Error("Email incorreto!")
    }

    // Verificar se esse email já está cadastrado na plataforma
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email
      }
    })

    if (userAlreadyExists) {
      throw new Error("Usuário já existe!")
    }

    const passwordHash = await hash(password, 8)

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    })

    return user
  }
}

export { CreateUserService }