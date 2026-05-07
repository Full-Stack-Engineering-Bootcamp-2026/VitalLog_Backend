import { VitalTypeValue, RangeStatusType } from "../../../common/constants/vital.constant";

// Request DTOs 
export interface CreateVitalRequestDto {
  vitalType: VitalTypeValue;
  value?: number;
  systolicValue?: number;
  diastolicValue?: number;
  loggedDate: string;
}

export interface UpdateVitalRequestDto {
  value?: number;
  systolicValue?: number;
  diastolicValue?: number;
}

export interface VitalQueryDto {
  vitalType?: VitalTypeValue;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}

// Response DTOs 
//VitalOutDto
export interface VitalResponseDto {
  id: number;
  vitalType: VitalTypeValue;
  value?: number;
  systolicValue?: number;
  diastolicValue?: number;
  unit?: string;
  status: RangeStatusType;
  loggedDate: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedVitalsResponseDto {
  data: VitalResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}