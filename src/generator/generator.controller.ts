import { Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { GeneratorService } from "./generator.service";

@Controller("generator")
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  generateTestData(): Promise<any> {
    return this.generatorService.generate();
  }
}
