export interface SignupInput {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    phone: string;
    turnstileToken: string    
  }  

  export interface LoginInput {
    email: string;
    password: string;
  }

  export interface ForgotPasswordInput {
    email: string;   
  }

  export interface ResetPasswordInput {
    token: string;  
    password: string;
  }