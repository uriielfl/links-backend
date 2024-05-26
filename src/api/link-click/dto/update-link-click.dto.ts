import { PartialType } from '@nestjs/mapped-types';

import { CreateLinkClickDto } from './create-link-click.dto';

export class UpdateLinkClickDto extends PartialType(CreateLinkClickDto) {}
