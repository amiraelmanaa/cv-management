
import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
} from 'class-validator';

export class CreateCvDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsInt()
  @Min(0)
  age: number;

  @IsString()
  @IsNotEmpty()
  Cin: string;

  @IsString()
  @IsNotEmpty()
  Job: string;
}
