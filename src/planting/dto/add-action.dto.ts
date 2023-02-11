import {
  Equals,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  validate,
} from "class-validator";
import { BadRequestException, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

import { ACTIONS } from "../../common/enums";
import {
  UNKNOWN_ACTION,
  INCORRECT_REQUEST,
} from "../../common/constants/error-messages";

class AddActionDto {
  @IsEnum(ACTIONS)
  readonly action: string;
  @IsString()
  @Length(10)
  @IsNotEmpty()
  readonly date: string;
}

class AddActionFertilize extends AddActionDto {
  @Equals(ACTIONS.FERTILIZE)
  readonly action: string;
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly fertilizer: string;
}

class AddActionDie extends AddActionDto {
  @Equals(ACTIONS.DIE)
  readonly action: string;
  @IsNumber()
  @IsNotEmpty()
  readonly died: number;
}

export class AddActionPipe implements PipeTransform {
  async transform(value: any): Promise<any> {
    let errors: object[];
    switch (value.action) {
      case ACTIONS.CUT:
      case ACTIONS.SELL:
        if (value.fertilizer || value.died) {
          throw new BadRequestException(INCORRECT_REQUEST);
        }
        errors = await validate(plainToInstance(AddActionDto, value));
        break;
      case ACTIONS.FERTILIZE:
        if (value.died) {
          throw new BadRequestException(INCORRECT_REQUEST);
        }
        errors = await validate(plainToInstance(AddActionFertilize, value));
        break;
      case ACTIONS.DIE:
        if (value.fertilizer) {
          throw new BadRequestException(INCORRECT_REQUEST);
        }
        errors = await validate(plainToInstance(AddActionDie, value));
        break;
      default:
        throw new BadRequestException(UNKNOWN_ACTION);
    }
    if (errors.length) {
      throw new BadRequestException(INCORRECT_REQUEST);
    }
    return value;
  }
}
export type AddActionType = AddActionDto | AddActionFertilize | AddActionDie;
