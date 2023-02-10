import { BadRequestException } from "@nestjs/common";
import { INCORRECT_TREE_TYPE } from "./constants/error-messages";
import { APPLE, CHERRY } from "./enums";

interface TreeInterface {
  readonly name: string;
  readonly area: number;
  readonly growingTime: number;
  readonly percentOfDeath: number;
  readonly pruningCount: number;
}

class AppleTree implements TreeInterface {
  readonly name: string;
  readonly area: number;
  readonly growingTime: number;
  readonly percentOfDeath: number;
  readonly pruningCount: number;

  constructor() {
    this.name = APPLE;
    this.area = 60;
    this.growingTime = 12 * 3;
    this.percentOfDeath = 0.15;
    this.pruningCount = 2;
  }
}
class CherryTree implements TreeInterface {
  readonly name: string;
  readonly area: number;
  readonly growingTime: number;
  readonly percentOfDeath: number;
  readonly pruningCount: number;

  constructor() {
    this.name = CHERRY;
    this.area = 40;
    this.growingTime = 12 * 2;
    this.percentOfDeath = 0.08;
    this.pruningCount = 2;
  }
}

export class TreeEntity implements TreeInterface {
  readonly name: string;
  readonly area: number;
  readonly growingTime: number;
  readonly percentOfDeath: number;
  readonly pruningCount: number;

  constructor(name: string) {
    switch (name) {
      case APPLE:
        return new AppleTree();
      case CHERRY:
        return new CherryTree();
      default:
        throw new BadRequestException(INCORRECT_TREE_TYPE);
    }
  }
}
