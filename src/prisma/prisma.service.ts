import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    this.$use(async (params, next) => {
      const modelList = ['Space', 'Role', 'Post', 'Chat'];
      if (modelList.includes(params.model)) {
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['isDeleted'] = false;
        }
        if (params.action === 'findMany') {
          if (params.args.where) {
            params.args.where['isDeleted'] = false;
          } else {
            params.args['where'] = { isDeleted: false };
          }
        }
      }
      return next(params);
    });
  }
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication): Promise<void> {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
