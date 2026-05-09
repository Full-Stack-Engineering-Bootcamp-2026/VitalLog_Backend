import { GenderType } from "../../../common/constants/gender.constants";

export interface ProfileResponseDto {
  id: number;
  age?: number | null;
  gender?: GenderType | null;
  height?: number | null;
  weight?: number | null;
  medicalConditions?: string | null;
  fitnessGoal?: string | null;
  profileImageUrl?: string | null;
}

export interface UpdateProfileRequestDto {
  age?: number;
  gender?: GenderType;
  height?: number;
  weight?: number;
  medicalConditions?: string;
  fitnessGoal?: string;
}

export interface UploadProfileImageResponseDto {
  profileImageUrl: string;
}
