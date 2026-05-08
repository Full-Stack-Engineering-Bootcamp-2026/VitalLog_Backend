// request dto for creating a fitness log
export interface CreateFitnessLogRequestDto {
  activityType: string;
  duration: number;
  caloriesBurned: number;
  date: string;
  distance?: string;
  notes?: string;
}

// request dto for updating a fitness log
export interface UpdateFitnessLogRequestDto {
  activityType?: string;
  duration?: number;
  caloriesBurned?: number;
  date?: string;
  distance?: string;
  notes?: string;
}

// query params dto
export interface FitnessQueryDto {
  activityType?: string;
  from?: string;
  to?: string;
  page?: string;
  limit?: string;
}

// response dto
export interface FitnessLogResponseDto {
  id: number;
  activityType: string;
  duration: number;
  caloriesBurned: number;
  date: string;
  distance?: string;
  notes?: string;
  createdAt: Date;
}

// paginated response dto
export interface PaginatedFitnessLogsResponseDto {
  data: FitnessLogResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
