export interface throwSchema {
  statusCode: number;
  message: string;
  errorStack: any;
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
