# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`default-connector/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*GetUserInfo*](#getuserinfo)
  - [*GetAllUsers*](#getallusers)
  - [*getUserByEmail*](#getuserbyemail)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateUserInfo*](#createuserinfo)
  - [*UpdateUserInfo*](#updateuserinfo)
  - [*DeleteUserInfo*](#deleteuserinfo)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@firebasegen/default-connector` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    email: string;
    name: string;
    createdAt: TimestampString;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@firebasegen/default-connector';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@firebasegen/default-connector';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetUserInfo
You can execute the `GetUserInfo` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getUserInfo(vars: GetUserInfoVariables): QueryPromise<GetUserInfoData, GetUserInfoVariables>;

interface GetUserInfoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserInfoVariables): QueryRef<GetUserInfoData, GetUserInfoVariables>;
}
export const getUserInfoRef: GetUserInfoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserInfo(dc: DataConnect, vars: GetUserInfoVariables): QueryPromise<GetUserInfoData, GetUserInfoVariables>;

interface GetUserInfoRef {
  ...
  (dc: DataConnect, vars: GetUserInfoVariables): QueryRef<GetUserInfoData, GetUserInfoVariables>;
}
export const getUserInfoRef: GetUserInfoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserInfoRef:
```typescript
const name = getUserInfoRef.operationName;
console.log(name);
```

### Variables
The `GetUserInfo` query requires an argument of type `GetUserInfoVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserInfoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserInfo` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserInfoData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserInfo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserInfo, GetUserInfoVariables } from '@firebasegen/default-connector';

// The `GetUserInfo` query requires an argument of type `GetUserInfoVariables`:
const getUserInfoVars: GetUserInfoVariables = {
  id: ..., 
};

// Call the `getUserInfo()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserInfo(getUserInfoVars);
// Variables can be defined inline as well.
const { data } = await getUserInfo({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserInfo(dataConnect, getUserInfoVars);

console.log(data.userInfo);

// Or, you can use the `Promise` API.
getUserInfo(getUserInfoVars).then((response) => {
  const data = response.data;
  console.log(data.userInfo);
});
```

### Using `GetUserInfo`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserInfoRef, GetUserInfoVariables } from '@firebasegen/default-connector';

// The `GetUserInfo` query requires an argument of type `GetUserInfoVariables`:
const getUserInfoVars: GetUserInfoVariables = {
  id: ..., 
};

// Call the `getUserInfoRef()` function to get a reference to the query.
const ref = getUserInfoRef(getUserInfoVars);
// Variables can be defined inline as well.
const ref = getUserInfoRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserInfoRef(dataConnect, getUserInfoVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.userInfo);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.userInfo);
});
```

## GetAllUsers
You can execute the `GetAllUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getAllUsers(): QueryPromise<GetAllUsersData, undefined>;

interface GetAllUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllUsersData, undefined>;
}
export const getAllUsersRef: GetAllUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllUsers(dc: DataConnect): QueryPromise<GetAllUsersData, undefined>;

interface GetAllUsersRef {
  ...
  (dc: DataConnect): QueryRef<GetAllUsersData, undefined>;
}
export const getAllUsersRef: GetAllUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllUsersRef:
```typescript
const name = getAllUsersRef.operationName;
console.log(name);
```

### Variables
The `GetAllUsers` query has no variables.
### Return Type
Recall that executing the `GetAllUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllUsersData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetAllUsersData {
  users: ({
    id: string;
    email: string;
    name: string;
    createdAt: TimestampString;
  } & User_Key)[];
}
```
### Using `GetAllUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllUsers } from '@firebasegen/default-connector';


// Call the `getAllUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
getAllUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `GetAllUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllUsersRef } from '@firebasegen/default-connector';


// Call the `getAllUsersRef()` function to get a reference to the query.
const ref = getAllUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## getUserByEmail
You can execute the `getUserByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
getUserByEmail(vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables): QueryPromise<GetUserByEmailData, GetUserByEmailVariables>;

interface GetUserByEmailRef {
  ...
  (dc: DataConnect, vars: GetUserByEmailVariables): QueryRef<GetUserByEmailData, GetUserByEmailVariables>;
}
export const getUserByEmailRef: GetUserByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserByEmailRef:
```typescript
const name = getUserByEmailRef.operationName;
console.log(name);
```

### Variables
The `getUserByEmail` query requires an argument of type `GetUserByEmailVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `getUserByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserByEmailData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserByEmailData {
  users: ({
    id: string;
    email: string;
    password: string;
  } & User_Key)[];
}
```
### Using `getUserByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserByEmail, GetUserByEmailVariables } from '@firebasegen/default-connector';

// The `getUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserByEmail(getUserByEmailVars);
// Variables can be defined inline as well.
const { data } = await getUserByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserByEmail(dataConnect, getUserByEmailVars);

console.log(data.users);

// Or, you can use the `Promise` API.
getUserByEmail(getUserByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `getUserByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserByEmailRef, GetUserByEmailVariables } from '@firebasegen/default-connector';

// The `getUserByEmail` query requires an argument of type `GetUserByEmailVariables`:
const getUserByEmailVars: GetUserByEmailVariables = {
  email: ..., 
};

// Call the `getUserByEmailRef()` function to get a reference to the query.
const ref = getUserByEmailRef(getUserByEmailVars);
// Variables can be defined inline as well.
const ref = getUserByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserByEmailRef(dataConnect, getUserByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  email: string;
  name: string;
  password: string;
  phone?: string | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@firebasegen/default-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  email: ..., 
  name: ..., 
  password: ..., 
  phone: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ email: ..., name: ..., password: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@firebasegen/default-connector';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  email: ..., 
  name: ..., 
  password: ..., 
  phone: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ email: ..., name: ..., password: ..., phone: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateUserInfo
You can execute the `CreateUserInfo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
createUserInfo(vars: CreateUserInfoVariables): MutationPromise<CreateUserInfoData, CreateUserInfoVariables>;

interface CreateUserInfoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserInfoVariables): MutationRef<CreateUserInfoData, CreateUserInfoVariables>;
}
export const createUserInfoRef: CreateUserInfoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUserInfo(dc: DataConnect, vars: CreateUserInfoVariables): MutationPromise<CreateUserInfoData, CreateUserInfoVariables>;

interface CreateUserInfoRef {
  ...
  (dc: DataConnect, vars: CreateUserInfoVariables): MutationRef<CreateUserInfoData, CreateUserInfoVariables>;
}
export const createUserInfoRef: CreateUserInfoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserInfoRef:
```typescript
const name = createUserInfoRef.operationName;
console.log(name);
```

### Variables
The `CreateUserInfo` mutation requires an argument of type `CreateUserInfoVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserInfoVariables {
  userId: string;
  activityFactor?: string | null;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
}
```
### Return Type
Recall that executing the `CreateUserInfo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserInfoData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserInfoData {
  userInfo_insert: UserInfo_Key;
}
```
### Using `CreateUserInfo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUserInfo, CreateUserInfoVariables } from '@firebasegen/default-connector';

// The `CreateUserInfo` mutation requires an argument of type `CreateUserInfoVariables`:
const createUserInfoVars: CreateUserInfoVariables = {
  userId: ..., 
  activityFactor: ..., // optional
  age: ..., // optional
  gender: ..., // optional
  height: ..., // optional
  weight: ..., // optional
};

// Call the `createUserInfo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUserInfo(createUserInfoVars);
// Variables can be defined inline as well.
const { data } = await createUserInfo({ userId: ..., activityFactor: ..., age: ..., gender: ..., height: ..., weight: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUserInfo(dataConnect, createUserInfoVars);

console.log(data.userInfo_insert);

// Or, you can use the `Promise` API.
createUserInfo(createUserInfoVars).then((response) => {
  const data = response.data;
  console.log(data.userInfo_insert);
});
```

### Using `CreateUserInfo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserInfoRef, CreateUserInfoVariables } from '@firebasegen/default-connector';

// The `CreateUserInfo` mutation requires an argument of type `CreateUserInfoVariables`:
const createUserInfoVars: CreateUserInfoVariables = {
  userId: ..., 
  activityFactor: ..., // optional
  age: ..., // optional
  gender: ..., // optional
  height: ..., // optional
  weight: ..., // optional
};

// Call the `createUserInfoRef()` function to get a reference to the mutation.
const ref = createUserInfoRef(createUserInfoVars);
// Variables can be defined inline as well.
const ref = createUserInfoRef({ userId: ..., activityFactor: ..., age: ..., gender: ..., height: ..., weight: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserInfoRef(dataConnect, createUserInfoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userInfo_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userInfo_insert);
});
```

## UpdateUserInfo
You can execute the `UpdateUserInfo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
updateUserInfo(vars: UpdateUserInfoVariables): MutationPromise<UpdateUserInfoData, UpdateUserInfoVariables>;

interface UpdateUserInfoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateUserInfoVariables): MutationRef<UpdateUserInfoData, UpdateUserInfoVariables>;
}
export const updateUserInfoRef: UpdateUserInfoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserInfo(dc: DataConnect, vars: UpdateUserInfoVariables): MutationPromise<UpdateUserInfoData, UpdateUserInfoVariables>;

interface UpdateUserInfoRef {
  ...
  (dc: DataConnect, vars: UpdateUserInfoVariables): MutationRef<UpdateUserInfoData, UpdateUserInfoVariables>;
}
export const updateUserInfoRef: UpdateUserInfoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserInfoRef:
```typescript
const name = updateUserInfoRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserInfo` mutation requires an argument of type `UpdateUserInfoVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserInfoVariables {
  id: UUIDString;
  activityFactor?: string | null;
  age?: number | null;
  gender?: string | null;
  height?: number | null;
  weight?: number | null;
}
```
### Return Type
Recall that executing the `UpdateUserInfo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserInfoData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserInfoData {
  userInfo_update?: UserInfo_Key | null;
}
```
### Using `UpdateUserInfo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserInfo, UpdateUserInfoVariables } from '@firebasegen/default-connector';

// The `UpdateUserInfo` mutation requires an argument of type `UpdateUserInfoVariables`:
const updateUserInfoVars: UpdateUserInfoVariables = {
  id: ..., 
  activityFactor: ..., // optional
  age: ..., // optional
  gender: ..., // optional
  height: ..., // optional
  weight: ..., // optional
};

// Call the `updateUserInfo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserInfo(updateUserInfoVars);
// Variables can be defined inline as well.
const { data } = await updateUserInfo({ id: ..., activityFactor: ..., age: ..., gender: ..., height: ..., weight: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserInfo(dataConnect, updateUserInfoVars);

console.log(data.userInfo_update);

// Or, you can use the `Promise` API.
updateUserInfo(updateUserInfoVars).then((response) => {
  const data = response.data;
  console.log(data.userInfo_update);
});
```

### Using `UpdateUserInfo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserInfoRef, UpdateUserInfoVariables } from '@firebasegen/default-connector';

// The `UpdateUserInfo` mutation requires an argument of type `UpdateUserInfoVariables`:
const updateUserInfoVars: UpdateUserInfoVariables = {
  id: ..., 
  activityFactor: ..., // optional
  age: ..., // optional
  gender: ..., // optional
  height: ..., // optional
  weight: ..., // optional
};

// Call the `updateUserInfoRef()` function to get a reference to the mutation.
const ref = updateUserInfoRef(updateUserInfoVars);
// Variables can be defined inline as well.
const ref = updateUserInfoRef({ id: ..., activityFactor: ..., age: ..., gender: ..., height: ..., weight: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserInfoRef(dataConnect, updateUserInfoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userInfo_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userInfo_update);
});
```

## DeleteUserInfo
You can execute the `DeleteUserInfo` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [default-connector/index.d.ts](./index.d.ts):
```typescript
deleteUserInfo(vars: DeleteUserInfoVariables): MutationPromise<DeleteUserInfoData, DeleteUserInfoVariables>;

interface DeleteUserInfoRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteUserInfoVariables): MutationRef<DeleteUserInfoData, DeleteUserInfoVariables>;
}
export const deleteUserInfoRef: DeleteUserInfoRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUserInfo(dc: DataConnect, vars: DeleteUserInfoVariables): MutationPromise<DeleteUserInfoData, DeleteUserInfoVariables>;

interface DeleteUserInfoRef {
  ...
  (dc: DataConnect, vars: DeleteUserInfoVariables): MutationRef<DeleteUserInfoData, DeleteUserInfoVariables>;
}
export const deleteUserInfoRef: DeleteUserInfoRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserInfoRef:
```typescript
const name = deleteUserInfoRef.operationName;
console.log(name);
```

### Variables
The `DeleteUserInfo` mutation requires an argument of type `DeleteUserInfoVariables`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteUserInfoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteUserInfo` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserInfoData`, which is defined in [default-connector/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserInfoData {
  userInfo_delete?: UserInfo_Key | null;
}
```
### Using `DeleteUserInfo`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUserInfo, DeleteUserInfoVariables } from '@firebasegen/default-connector';

// The `DeleteUserInfo` mutation requires an argument of type `DeleteUserInfoVariables`:
const deleteUserInfoVars: DeleteUserInfoVariables = {
  id: ..., 
};

// Call the `deleteUserInfo()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUserInfo(deleteUserInfoVars);
// Variables can be defined inline as well.
const { data } = await deleteUserInfo({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUserInfo(dataConnect, deleteUserInfoVars);

console.log(data.userInfo_delete);

// Or, you can use the `Promise` API.
deleteUserInfo(deleteUserInfoVars).then((response) => {
  const data = response.data;
  console.log(data.userInfo_delete);
});
```

### Using `DeleteUserInfo`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserInfoRef, DeleteUserInfoVariables } from '@firebasegen/default-connector';

// The `DeleteUserInfo` mutation requires an argument of type `DeleteUserInfoVariables`:
const deleteUserInfoVars: DeleteUserInfoVariables = {
  id: ..., 
};

// Call the `deleteUserInfoRef()` function to get a reference to the mutation.
const ref = deleteUserInfoRef(deleteUserInfoVars);
// Variables can be defined inline as well.
const ref = deleteUserInfoRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserInfoRef(dataConnect, deleteUserInfoVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.userInfo_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.userInfo_delete);
});
```

