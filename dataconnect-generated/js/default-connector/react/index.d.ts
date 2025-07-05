import { CreateUserData, CreateUserVariables, CreateUserInfoData, CreateUserInfoVariables, UpdateUserInfoData, UpdateUserInfoVariables, DeleteUserInfoData, DeleteUserInfoVariables, GetUserData, GetUserVariables, GetUserInfoData, GetUserInfoVariables, GetAllUsersData, GetUserByEmailData, GetUserByEmailVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;

export function useCreateUserInfo(options?: useDataConnectMutationOptions<CreateUserInfoData, FirebaseError, CreateUserInfoVariables>): UseDataConnectMutationResult<CreateUserInfoData, CreateUserInfoVariables>;
export function useCreateUserInfo(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserInfoData, FirebaseError, CreateUserInfoVariables>): UseDataConnectMutationResult<CreateUserInfoData, CreateUserInfoVariables>;

export function useUpdateUserInfo(options?: useDataConnectMutationOptions<UpdateUserInfoData, FirebaseError, UpdateUserInfoVariables>): UseDataConnectMutationResult<UpdateUserInfoData, UpdateUserInfoVariables>;
export function useUpdateUserInfo(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserInfoData, FirebaseError, UpdateUserInfoVariables>): UseDataConnectMutationResult<UpdateUserInfoData, UpdateUserInfoVariables>;

export function useDeleteUserInfo(options?: useDataConnectMutationOptions<DeleteUserInfoData, FirebaseError, DeleteUserInfoVariables>): UseDataConnectMutationResult<DeleteUserInfoData, DeleteUserInfoVariables>;
export function useDeleteUserInfo(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserInfoData, FirebaseError, DeleteUserInfoVariables>): UseDataConnectMutationResult<DeleteUserInfoData, DeleteUserInfoVariables>;

export function useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
export function useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;

export function useGetUserInfo(vars: GetUserInfoVariables, options?: useDataConnectQueryOptions<GetUserInfoData>): UseDataConnectQueryResult<GetUserInfoData, GetUserInfoVariables>;
export function useGetUserInfo(dc: DataConnect, vars: GetUserInfoVariables, options?: useDataConnectQueryOptions<GetUserInfoData>): UseDataConnectQueryResult<GetUserInfoData, GetUserInfoVariables>;

export function useGetAllUsers(options?: useDataConnectQueryOptions<GetAllUsersData>): UseDataConnectQueryResult<GetAllUsersData, undefined>;
export function useGetAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<GetAllUsersData>): UseDataConnectQueryResult<GetAllUsersData, undefined>;

export function useGetUserByEmail(vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
export function useGetUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
