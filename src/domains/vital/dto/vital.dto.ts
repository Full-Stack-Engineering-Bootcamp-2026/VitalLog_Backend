//input dto -> fields required to log vital

export interface CreateVitalDto {
  vitaltype: string;
  value?: number;
  systolicValue?: number;
  diastolicValue?: number;
  loggedDate: string; // "YYYY-MM-DD"
}

//query DTO -> filters for getting vitals list
export interface QueryVitalDto {
  vitalType?: string;
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
  page?: string; // default "1"
  limit?: string; // default "10"
}

//output DTO -> shape returned to client

export interface VitalOutDto {
  id: number;
  vitalType: string;
  value?: number;
  systolicValue?: number;
  diastolicValue?: number;
  unit?: string;
  status: string;
  loggedDate: string;
  createdAt: Date;
  updatedAt: Date;
}
