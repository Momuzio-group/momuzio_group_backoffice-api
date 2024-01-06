import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';
import { DatabaseModule } from './app/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    ProfilesModule,
    UsersModule,
    ContributorsModule,
    OrganizationsModule,
    AuthProvidersModule,
  ],
})
export class AppModule {}
