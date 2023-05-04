import {
  Controller,
  Get,
  Put,
  HttpStatus,
  Param,
  Query,
  HttpCode,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { AuditService } from "./audit.service";
import {
  QueryPaginationDto,
  ObjectIdParamDto,
  CreatePaginationDto,
} from "../common/dto";

@UseGuards(AuthGuard("jwt"))
@Controller("audit")
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async revertAudit(@Param() param: ObjectIdParamDto): Promise<any> {
    return await this.auditService.revertAudit(param.id);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAuditList(@Query() query: QueryPaginationDto): Promise<any> {
    const paginationParams = new CreatePaginationDto(query);

    return await this.auditService.getAllAudits(paginationParams);
  }
}
