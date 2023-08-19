import { Module } from "@nestjs/common";
import { DatabaseModule } from "@app/common/database/database.module";

@Module({
  imports: [DatabaseModule],
})
export class AppModule {}
