import { Document } from 'mongoose';

export interface IPrice extends Document {
    readonly name: string,
    readonly price: number,
}