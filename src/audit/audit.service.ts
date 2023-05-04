import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";

import { Audit, AuditDocument, Price, PriceDocument } from "../models";
import { QueryPaginationDto } from "../common/dto";
import {
  NO_AUDIT_FOUND,
  UNKNOWN_AUDIT_ENTITY,
} from "../common/constants/error-messages";
import { transaction } from "../common/transaction";
import { AUDIT_ENTITIES } from "../common/enums";

@Injectable()
export class AuditService {
  constructor(
    @InjectModel(Audit.name) private auditModel: Model<AuditDocument>,
    @InjectModel(Price.name) private priceModel: Model<PriceDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async revertAudit(id) {
    const audit = await this.auditModel.findById(id);
    if (!audit) {
      throw new BadRequestException(NO_AUDIT_FOUND);
    }
    // todo process different types of audits
    await transaction(this.connection, async (session) => {
      switch (audit.entity) {
        case AUDIT_ENTITIES.PRICE:
          break;
        case AUDIT_ENTITIES.SORT:
          break;
        case AUDIT_ENTITIES.PLANTING:
          break;
        default:
          throw new BadRequestException(UNKNOWN_AUDIT_ENTITY);
      }
    });
  }

  async getAllAudits({ skip, limit }: QueryPaginationDto) {
    const audits = await this.auditModel.find().skip(skip).limit(limit);
    // todo get all or get by entity
    return this.mapAudits(audits);
  }

  private mapAudits(audits) {
    return audits.map((audit) => ({
      id: audit.id,
      entity: audit.entity,
      actions: audit.actions,
      datetime: audit.datetime,
      user: audit.user,
    }));
  }
}
