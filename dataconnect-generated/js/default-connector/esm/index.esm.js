import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'healtheaty-app',
  location: 'us-central1'
};

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const createUserInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUserInfo', inputVars);
}
createUserInfoRef.operationName = 'CreateUserInfo';

export function createUserInfo(dcOrVars, vars) {
  return executeMutation(createUserInfoRef(dcOrVars, vars));
}

export const updateUserInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserInfo', inputVars);
}
updateUserInfoRef.operationName = 'UpdateUserInfo';

export function updateUserInfo(dcOrVars, vars) {
  return executeMutation(updateUserInfoRef(dcOrVars, vars));
}

export const deleteUserInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteUserInfo', inputVars);
}
deleteUserInfoRef.operationName = 'DeleteUserInfo';

export function deleteUserInfo(dcOrVars, vars) {
  return executeMutation(deleteUserInfoRef(dcOrVars, vars));
}

export const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';

export function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
}

export const getUserInfoRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserInfo', inputVars);
}
getUserInfoRef.operationName = 'GetUserInfo';

export function getUserInfo(dcOrVars, vars) {
  return executeQuery(getUserInfoRef(dcOrVars, vars));
}

export const getAllUsersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllUsers');
}
getAllUsersRef.operationName = 'GetAllUsers';

export function getAllUsers(dc) {
  return executeQuery(getAllUsersRef(dc));
}

export const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'getUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'getUserByEmail';

export function getUserByEmail(dcOrVars, vars) {
  return executeQuery(getUserByEmailRef(dcOrVars, vars));
}

