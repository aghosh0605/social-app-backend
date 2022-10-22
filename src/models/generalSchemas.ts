export interface throwSchema {
  statusCode: number;
  message: string;
  errorStack: any;
  data: object;
}

export interface nextError {
  statusCode: number;
  message: string;
}

export interface responseSchema {
  status: number;
  success: boolean;
  message: string;
}
