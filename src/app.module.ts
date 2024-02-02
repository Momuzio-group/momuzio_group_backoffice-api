import { Module } from '@nestjs/common';
import { DatabaseModule } from './app/database/database.module';
import { AuthProvidersModule } from './modules/auth-providers/auth-providers.module';
import { ContributorsModule } from './modules/contributors/contributors.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    ProfilesModule,
    UsersModule,
    MembershipsModule,
    ContributorsModule,
    OrganizationsModule,
    AuthProvidersModule,
  ],
})
export class AppModule {}
