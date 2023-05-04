import { ChangeRoleDto } from './../space/dto/space.changerole.dto';
import { SpaceCodeManagerReturnDto } from './../space/dto/space.return.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth, Chat } from '@prisma/client';
import { ChatAllReturnDto } from './dto/chat.return.dto';

@Injectable()
export class ChatRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async makeChat(
    content: string,
    authoremail: string,
    isAnonymous,
    spacename,
    postId,
  ): Promise<any> {
    const chat = await this.prismaService.chat.create({
      data: {
        content: content,
        author: { connect: { email: authoremail } },
        isAnonymous: isAnonymous,
        post: { connect: { id: postId } },
        space: { connect: { name: spacename } },
      },
    });
    await this.prismaService.chat.update({
      where: { validchat: { id: chat.id, isDeleted: false } },
      data: { root: { connect: { id: chat.id } } },
    });
  }

  async makeChildChat(
    chatId: number,
    content: string,
    authoremail: string,
    isAnonymous,
    spacename,
    postId,
  ): Promise<any> {
    const parentChat = await this.prismaService.chat.findFirst({
      where: { id: chatId, isDeleted: false },
    });
    const maxlevel = await this.prismaService.chat.findFirst({
      where: { rootId: parentChat.rootId, isDeleted: false },
      orderBy: { level: 'desc' },
      take: 1,
    });
    const level = parentChat.level + 1;
    if (level < maxlevel.level) {
      let nextOrder = await this.prismaService.chat.findFirst({
        where: {
          AND: [
            {
              level: parentChat.level,
              rootId: parentChat.rootId,
              isDeleted: false,
            },
            { order: { gt: parentChat.order } },
          ],
        },
        orderBy: { level: 'asc' },
        take: 1,
      });
      if (nextOrder === null) {
        nextOrder = await this.prismaService.chat.findFirst({
          where: { rootId: parentChat.rootId, isDeleted: false },
          orderBy: { order: 'desc' },
          take: 1,
        });
        nextOrder.order += 1;
      }
      const childchat = this.childOrder(
        parentChat,
        level,
        content,
        authoremail,
        isAnonymous,
        spacename,
        postId,
        nextOrder.order - 1,
      );
      return childchat;
    } else if (level === maxlevel.level) {
      const order = parentChat.order + parentChat.answerNum;
      const childchat = this.childOrder(
        parentChat,
        level,
        content,
        authoremail,
        isAnonymous,
        spacename,
        postId,
        order,
      );
      return childchat;
    } else {
      const childchat = this.childOrder(
        parentChat,
        level,
        content,
        authoremail,
        isAnonymous,
        spacename,
        postId,
        parentChat.order,
      );
      return childchat;
    }
  }

  async childOrder(
    parentChat: Chat,
    level: number,
    content: string,
    authoremail: string,
    isAnonymous,
    spacename,
    postId,
    order: number,
  ): Promise<Chat | null> {
    await this.prismaService.chat.updateMany({
      where: {
        AND: [
          { rootId: parentChat.rootId, isDeleted: false },
          { order: { gt: order } },
        ],
      },
      data: { order: { increment: 1 } },
    });
    const childChat = await this.prismaService.chat.create({
      data: {
        content: content,
        author: { connect: { email: authoremail } },
        isAnonymous: isAnonymous,
        post: { connect: { id: postId } },
        space: { connect: { name: spacename } },
        parent: { connect: { id: parentChat.id } },
        root: { connect: { id: parentChat.rootId } },
        level: level,
        order: order + 1,
      },
    });
    await this.prismaService.chat.update({
      where: { validchat: { id: parentChat.id, isDeleted: false } },
      data: { answerNum: { increment: 1 } },
    });
    return childChat;
  }

  async isChatExist(
    spacename: string,
    postId: number,
    chatId: number,
  ): Promise<boolean> {
    const isExist = await this.prismaService.chat.findFirst({
      where: { id: chatId, spacename: spacename, postId: postId },
    });
    if (isExist) {
      return true;
    } else {
      return false;
    }
  }

  async listChatAdmin(
    postId: number,
    spacename: string,
  ): Promise<ChatAllReturnDto[]> {
    const postList = await this.prismaService.chat.findMany({
      where: { spacename: spacename, postId: postId, isDeleted: false },
      select: {
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        content: true,
        order: true,
        parentId: true,
        rootId: true,
        isAnonymous: true,
      },
    });
    return postList;
  }

  async listChatUser(
    postId: number,
    spacename: string,
    email: string,
  ): Promise<ChatAllReturnDto[]> {
    const chatListNotAnon = await this.prismaService.chat.findMany({
      where: {
        spacename: spacename,
        postId: postId,
        isDeleted: false,
        OR: [{ isAnonymous: false }, { authoremail: email }],
      },
      select: {
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        content: true,
        order: true,
        parentId: true,
        rootId: true,
        isAnonymous: true,
      },
    });
    const chatListAnon = await this.prismaService.chat.findMany({
      where: {
        spacename: spacename,
        postId: postId,
        isDeleted: false,
        isAnonymous: true,
        NOT: { authoremail: email },
      },
      select: {
        author: {
          select: {
            anonymous: true,
          },
        },
        content: true,
        order: true,
        parentId: true,
        rootId: true,
        isAnonymous: true,
      },
    });
    const chatList = { ...chatListNotAnon, ...chatListAnon };
    return chatList;
  }
  async isChatAuthor(
    postId: number,
    chatId: number,
    email: string,
  ): Promise<boolean> {
    const chat = await this.prismaService.chat.findFirst({
      where: { postId: postId, id: chatId, authoremail: email },
      select: { id: true },
    });
    return chat ? true : false;
  }
  async editChat(content: string, chatId: number): Promise<ChatAllReturnDto> {
    const chat = await this.prismaService.chat.update({
      where: { validchat: { id: chatId, isDeleted: false } },
      data: { content: content },
      select: {
        author: {
          select: {
            email: true,
            first_name: true,
            last_name: true,
            imgUrl: true,
          },
        },
        content: true,
        order: true,
        parentId: true,
        rootId: true,
        isAnonymous: true,
      },
    });
    return chat;
  }

  async deleteChat(chatId: number): Promise<boolean> {
    const chat = await this.prismaService.chat.update({
      where: { validchat: { id: chatId, isDeleted: false } },
      data: { isDeleted: true },
      select: {
        isDeleted: true,
      },
    });
    return chat.isDeleted;
  }
}
