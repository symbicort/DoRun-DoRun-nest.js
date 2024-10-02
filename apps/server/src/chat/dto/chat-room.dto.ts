import { IsNotEmpty, IsString, IsArray } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { format } from 'date-fns';

export class RoomDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  userid: string;

  @IsNotEmpty()
  @IsString()
  ai: string;

  @IsArray()
  @IsString({ each: true })
  messages?: string[];

  @Transform(({ value }) =>
    value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : null,
  )
  @Type(() => Date)
  createdAt: Date;
}
