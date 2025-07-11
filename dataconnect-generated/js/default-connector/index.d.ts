import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserInfoData {
  userInfo_insert: UserInfo_Key;
}

export interface CreateUserInfoVariables {
  userId: string;
  activityFactor?: string | null;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
}

export interface CreateUserVariables {
  email: string;
  name: string;
  password: string;
  phone?: string | null;
}

export interface DeleteUserInfoData {
  userInfo_delete?: UserInfo_Key | null;
}

export interface DeleteUserInfoVariables {
  id: UUIDString;
}

export interface GetAllUsersData {
  users: ({
    id: string;
    email: string;
    name: string;
    createdAt: TimestampString;
  } & User_Key)[];
}

export interface GetUserByEmailData {
  users: ({
    id: string;
    email: string;
    password: string;
  } & User_Key)[];
}

export interface GetUserByEmailVariables {
  email: string;
}

export interface GetUserData {
  user?: {
    id: string;
    email: string;
    name: string;
    createdAt: TimestampString;
  } & User_Key;
}

export interface GetUserInfoData {
  userInfo?: {
    id: UUIDString;
    userId: string;
    activityFactor?: string | null;
    age?: number | null;
    gender?: string | null;
    height?: number | null;
    weight?: number | null;
    createdAt: TimestampString;
  } & UserInfo_Key;
}

export interface GetUserInfoVariables {
  id: UUIDString;
}

export interface GetUserVariables {
  id: string;
}

export interface UpdateUserInfoData {
  userInfo_update?: UserInfo_Key | null;
}

export interface UpdateUserInfoVariables {
  id: UUIDString;
  activityFactor?: string | null;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
}

export interface UserInfo_Key {
  id: UUIDString;
  __typename?: 'UserInfo_Key';
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserInfoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserInfoVariables): MutationRef<CreateUserInfoData, CreateUserInfoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserInfoVariables): MutationRef<CreateUserInfoData, CreateUserInfoVariables>;
  operationName: string;
}
export const createUserInfoRef: CreateUserInfoRef;

export function createUserInfo(vars: CreateUserInfoVariables): MutationPromise<CreateUserInfoData, CreateUserInfoVariables>;
export function createUserInfo(dc: DataConnect, vars: CreateUserInfoVariables): MutationPromise<CreateUserInfoData, CreateUserInfoVariables>;

interface UpdateUserInfoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserInfoVariables): MutationRef<UpdateUserInfoData, UpdateUserInfoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateUserInfoVariables): MutationRef<UpdateUserInfoData, UpdateUserInfoVariables>;
  operationName: string;
}
export const updateUserInfoRef: UpdateUserInfoRef;

export function updateUserInfo(vars: UpdateUserInfoVariables): MutationPromise<UpdateUserInfoData, UpdateUserInfoVariables>;
export function updateUserInfo(dc: DataConnect, vars: UpdateUserInfoVariables): MutationPromise<UpdateUserInfoData, UpdateUserInfoVariables>;

interface DeleteUserInfoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserInfoVariables): MutationRef<DeleteUserInfoData, DeleteUserInfoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteUserInfoVariables): MutationRef<DeleteUserInfoData, DeleteUserInfoVariables>;
  operationName: string;
}
export const deleteUserInfoRef: DeleteUserInfoRef;

export function deleteUserInfo(vars: DeleteUserInfoVariables): MutationPromise<DeleteUserInfoData, DeleteUserInfoVariables>;
export function deleteUserInfo(dc: DataConnect, vars: DeleteUserInfoVariables): MutationPromise<DeleteUserInfoData, DeleteUserInfoVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserInfoRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserInfoVariables): QueryRef<GetUserInfoData, GetUserInfoVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserInfoVariables): QueryRef<GetUserInfoData, GetUserInfoVariables>;
  operationName: string;
}
export const getUserInfoRef: GetUserInfoRef;

export function getUserInfo(vars: GetUserInfoVariables): QueryPromise<GetUserInfoData, GetUserInfoVariables>;
export function getUserInfo(dc: DataConnect, vars: GetUserInfoVariables): QueryPromise<GetUserInfoData, GetUserInfoVariables>;

interface GetAllUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAllUsersData, undefined>;
  operationName: string;
}
export const getAllUsersRef: GetAllUsersRef;

export function getAllUsers(): QueryPromise<GetAllUsersData, undefined>;
export function getAllUsers(dc: DataConnect): QueryPromise<GetAllUsersData, undefined>;

interface GetUserByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
  operationName: string;
}
export const getUserByEmailRef: GetUserByEmailRef;

export function getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;
export function getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

