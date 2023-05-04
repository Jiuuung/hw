import {
  ChatEditDeleteGuard,
  PostChatGuard,
} from './../auth/jwt/postchat.guard';
import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { ScuccessInterceptor } from 'src/common/interceptor/success.interceptor';
import { ChatService } from './chat.service';
import { RequestUserDto } from 'src/common/dto/common.dto';
import {
  Chat,
  ChatUserAdminDisting,
  UserRequest,
} from 'src/common/decorator/common.decorator';
import {
  ChatDeleteDto,
  ChatEditDto,
  ChatListDto,
  ChatMakeDto,
} from './dto/chat.request.dto';
import { ChatUserRoleGuard } from 'src/auth/jwt/authorole.guard';
import { ChatAllReturnDto } from './dto/chat.return.dto';

@Controller('chat')
@UseInterceptors(ScuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(PostChatGuard)
  @Post('new/:spacename/:postid')
  async makeChat(
    @Chat() body: ChatMakeDto,
    @UserRequest() user: RequestUserDto,
  ): Promise<any> {
    return await this.chatService.makeChat(body, user);
  }
  @UseGuards(PostChatGuard)
  @Post('new/:spacename/:postid/:chatid')
  async makeChildChat(
    @Chat() body: ChatMakeDto,
    @UserRequest() user: RequestUserDto,
  ): Promise<any> {
    return await this.chatService.makeChat(body, user);
  }

  @UseGuards(ChatUserRoleGuard)
  @Get('list/:spacename/:postid')
  async listChat(
    @ChatUserAdminDisting() body: ChatListDto,
    @UserRequest() user: RequestUserDto,
  ): Promise<ChatAllReturnDto[]> {
    return await this.chatService.listChat(body, user);
  }

  @UseGuards(ChatEditDeleteGuard)
  @Patch(':spacename/:postid/:chatid')
  async editChat(
    @Chat() body: ChatEditDto,
    @UserRequest() user: RequestUserDto,
  ): Promise<ChatAllReturnDto> {
    return await this.chatService.editChat(body, user);
  }

  @UseGuards(ChatEditDeleteGuard)
  @Delete(':spacename/:postid/:chatid')
  async deleteChat(
    @Chat() body: ChatDeleteDto,
    @UserRequest() user: RequestUserDto,
  ): Promise<boolean> {
    return await this.chatService.deleteChat(body, user);
  }
}
