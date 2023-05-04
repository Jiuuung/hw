import { ChatAllReturnDto } from './dto/chat.return.dto';
import { ChatRepository } from './chat.repository';
import { Injectable } from '@nestjs/common';
import { ChatEditDto, ChatListDto } from './dto/chat.request.dto';
import { RequestUserDto } from 'src/common/dto/common.dto';
import { Auth } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}
  async makeChat(body, user): Promise<any> {
    if (body.chatId === null) {
      return await this.chatRepository.makeChat(
        body.content,
        user.email,
        body.isAnonymous,
        body.spacename,
        body.postId,
      );
    } else {
      return await this.chatRepository.makeChildChat(
        body.chatId,
        body.content,
        user.email,
        body.isAnonymous,
        body.spacename,
        body.postId,
      );
    }
  }

  async listChat(
    body: ChatListDto,
    user: RequestUserDto,
  ): Promise<ChatAllReturnDto[]> {
    console.log(body);
    if (body.auth === Auth.ADMIN) {
      return await this.chatRepository.listChatAdmin(
        body.postId,
        body.spacename,
      );
    } else {
      return await this.chatRepository.listChatUser(
        body.postId,
        body.spacename,
        user.email,
      );
    }
  }

  async editChat(
    body: ChatEditDto,
    user: RequestUserDto,
  ): Promise<ChatAllReturnDto> {
    return await this.chatRepository.editChat(body.content, body.chatId);
  }

  async deleteChat(body: ChatEditDto, user: RequestUserDto): Promise<boolean> {
    return await this.chatRepository.deleteChat(body.chatId);
  }
}
