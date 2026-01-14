import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends: Types.ObjectId[];

  @Prop({ default: 0 })
  gamesPlayed: number;

  @Prop({ default: 0 })
  gamesWon: number;

  @Prop({ default: 0 })
  gamesLost: number;

  @Prop({ default: false })
  isOnline: boolean;

  @Prop({ default: null })
  lastSeenAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
