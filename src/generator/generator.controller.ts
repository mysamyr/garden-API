import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";

import { GeneratorService } from "./generator.service";
import { GenerateDto } from "./dto/generate.dto";

@Controller("generator")
export class GeneratorController {
  constructor(private readonly generatorService: GeneratorService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  generateTestData(@Body() generateDto: GenerateDto): Promise<any> {
    return this.generatorService.generate(generateDto);
  }
}
