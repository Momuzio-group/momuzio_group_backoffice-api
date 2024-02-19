import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { config } from './../../app/config/index';

import { validation_login_cookie_setting } from '../../app/utils/cookies';
import { ContributorsService } from '../contributors/contributors.service';
import { OrganizationsService } from '../organizations/organizations.service';
import { ProfilesService } from '../profiles/profiles.service';
import { CheckUserService } from './middleware/check-user.service';
import {
  CreateLoginUserDto,
  CreateOrUpdateResetPasswordDto,
  RegisterUserDto,
  TokenUserDto,
  UpdateResetPasswordUserDto,
} from './users.dto';
import { UsersService } from './users.service';
import { checkIfPasswordMatch, hashPassword } from './users.type';

@Controller()
export class UsersAuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
    private readonly checkUserService: CheckUserService,
    private readonly contributorsService: ContributorsService,
    private readonly organizationsService: OrganizationsService,
  ) {}

  /** Post one Users */
  @Post(`/register`)
  async createOne(@Res() res, @Body() body: RegisterUserDto) {
    const { email, password, firstName, lastName } = body;

    const findOneUser = await this.usersService.findOneBy({ email });
    if (findOneUser)
      throw new HttpException(
        `Email ${email} already exists please change`,
        HttpStatus.NOT_FOUND,
      );
    const user = await this.usersService.createOne({
      password: await hashPassword(password),
      provider: 'default',
      email: email.toLocaleLowerCase(),
    });

    await this.profilesService.createOne({
      firstName,
      lastName,
      userId: user.id,
    });

    const organization = await this.organizationsService.createOne({
      name: `${firstName} ${lastName}`,
      userId: user.id,
    });

    await this.usersService.updateOne(
      { userId: user.id },
      { organizationId: organization.id },
    );

    await this.contributorsService.createOne({
      role: 'SUPERADMIN',
      userId: user.id,
      organizationId: organization.id,
      userCreatedId: user.id,
    });

    return reply({ res, results: user });
  }

  /** Login user */
  @Post(`/login`)
  async createOneLogin(@Res() res, @Body() body: CreateLoginUserDto) {
    const { email, password } = body;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'default',
    });
    if (!(await checkIfPasswordMatch(findOnUser?.password, password)))
      throw new HttpException(`Invalid credentials`, HttpStatus.NOT_FOUND);

    const tokenUser = await this.checkUserService.createToken(
      { id: findOnUser.id, organizationId: findOnUser.organizationId },
      config.cookie_access.accessExpire,
    );

    res.cookie(
      config.cookie_access.nameLogin,
      tokenUser,
      validation_login_cookie_setting,
    );

    return reply({
      res,
      results: {
        id: findOnUser.id,
        organizationId: findOnUser.organizationId,
      },
    });
  }

  /** Reset password */
  @Post(`/password/reset`)
  async createOneResetPassword(
    @Res() res,
    @Body() body: CreateOrUpdateResetPasswordDto,
  ) {
    const { email } = body;

    const findOnUser = await this.usersService.findOneBy({
      email,
      provider: 'default',
    });
    if (!findOnUser)
      throw new HttpException(
        `Email ${email} dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );

    const token = await this.checkUserService.createToken(
      { userId: findOnUser.id, organizationId: findOnUser.organizationId },
      config.cookie_access.verifyExpire,
    );

    return reply({ res, results: { token } });
  }

  /** Update reset password */
  @Put(`/password/update/:token`)
  async updateOneResetPassword(
    @Res() res,
    @Body() body: UpdateResetPasswordUserDto,
    @Param() params: TokenUserDto,
  ) {
    const { password } = body;

    const payload = await this.checkUserService.verifyToken(params?.token);

    const findOnUser = await this.usersService.findOneBy({
      email: payload?.userId,
      provider: 'default',
    });
    if (!findOnUser)
      throw new HttpException(
        `User already exists please change`,
        HttpStatus.NOT_FOUND,
      );

    /** Check token */
    await this.usersService.updateOne({ userId: findOnUser?.id }, { password });

    return reply({ res, results: 'Password updated successfully' });
  }
}
