// types/attendance.ts
export interface AttendanceRecord {
  attendance_id: number;
  emp_id: number;
  date: string; // YYYY-MM-DD format
  check_in: string; // DATETIME format
  check_out: string | null; // DATETIME format, can be null
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';
}

export interface Employee {
  emp_id: number;
  user_id: number;
  department_id: number;
  designation: string;
  join_date: string;
}

export interface AttendanceFilters {
  startDate?: string;
  endDate?: string;
  status?: AttendanceRecord['status'];
  emp_id?: number;
}