import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { GeneratorService } from "./generator.service";
import { GenerateBodyDto } from "./dto";

@Controller("generator")
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  generateTestData(@Body() generateDto: GenerateBodyDto): Promise<any> {
    return this.generatorService.generate(generateDto);
  }
}
