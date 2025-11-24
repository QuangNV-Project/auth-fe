import { AuthService } from '@/api/service/auth.service'
import { useMutation, UseMutationResult } from '@tanstack/react-query';
import {
  LoginMutationArguments,
  RegisterMutationArguments,
  LoginMutationResponse,
  RegisterMutationResponse
} from './auth.types';
import { toast } from 'react-toastify';
import { StandardizedApiError } from '@/types/common.ts';
export const authMutations = {
  loginMutation: AuthService.handleLogin,
  registerMutation: AuthService.handleRegister,
}

export const useLoginMutation = (): UseMutationResult<LoginMutationResponse, StandardizedApiError, LoginMutationArguments> => {
  return useMutation({
    mutationFn: AuthService.handleLogin,
    onError: (errors: StandardizedApiError) => {
      toast.error(errors.message);
      Object.values(errors.errors).forEach(errorText => toast.error(errorText));
      console.error('Login mutation error:', errors);
    }
  });
};

export const useRegisterMutation = (): UseMutationResult<RegisterMutationResponse, Error, RegisterMutationArguments> => {
  return useMutation({
    mutationFn: AuthService.handleRegister
  });
};