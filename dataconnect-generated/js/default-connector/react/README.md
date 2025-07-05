# Generated React README
This README will guide you through the process of using the generated React SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `JavaScript README`, you can find it at [`default-connector/README.md`](../README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

You can use this generated SDK by importing from the package `@firebasegen/default-connector/react` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#react).

# Table of Contents
- [**Overview**](#generated-react-readme)
- [**TanStack Query Firebase & TanStack React Query**](#tanstack-query-firebase-tanstack-react-query)
  - [*Package Installation*](#installing-tanstack-query-firebase-and-tanstack-react-query-packages)
  - [*Configuring TanStack Query*](#configuring-tanstack-query)
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

# TanStack Query Firebase & TanStack React Query
This SDK provides [React](https://react.dev/) hooks generated specific to your application, for the operations found in the connector `default`. These hooks are generated using [TanStack Query Firebase](https://react-query-firebase.invertase.dev/) by our partners at Invertase, a library built on top of [TanStack React Query v5](https://tanstack.com/query/v5/docs/framework/react/overview).

***You do not need to be familiar with Tanstack Query or Tanstack Query Firebase to use this SDK.*** However, you may find it useful to learn more about them, as they will empower you as a user of this Generated React SDK.

## Installing TanStack Query Firebase and TanStack React Query Packages
In order to use the React generated SDK, you must install the `TanStack React Query` and `TanStack Query Firebase` packages.
```bash
npm i --save @tanstack/react-query @tanstack-query-firebase/react
```
```bash
npm i --save firebase@latest # Note: React has a peer dependency on ^11.3.0
```

You can also follow the installation instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#tanstack-install), or the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react) and [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/installation).

## Configuring TanStack Query
In order to use the React generated SDK in your application, you must wrap your application's component tree in a `QueryClientProvider` component from TanStack React Query. None of your generated React SDK hooks will work without this provider.

```javascript
import { QueryClientProvider } from '@tanstack/react-query';

// Create a TanStack Query client instance
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MyApplication />
    </QueryClientProvider>
  )
}
```

To learn more about `QueryClientProvider`, see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/quick-start) and the [TanStack Query Firebase documentation](https://invertase.docs.page/tanstack-query-firebase/react#usage).

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`.

You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#emulator-react-angular).

```javascript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) using the hooks provided from your generated React SDK.

# Queries

The React generated SDK provides Query hook functions that call and return [`useDataConnectQuery`](https://react-query-firebase.invertase.dev/react/data-connect/querying) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and the most recent data returned by the Query, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/querying).

TanStack React Query caches the results of your Queries, so using the same Query hook function in multiple places in your application allows the entire application to automatically see updates to that Query's data.

Query hooks execute their Queries automatically when called, and periodically refresh, unless you change the `queryOptions` for the Query. To learn how to stop a Query from automatically executing, including how to make a query "lazy", see the [TanStack React Query documentation](https://tanstack.com/query/latest/docs/framework/react/guides/disabling-queries).

To learn more about TanStack React Query's Queries, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/queries).

## Using Query Hooks
Here's a general overview of how to use the generated Query hooks in your code:

- If the Query has no variables, the Query hook function does not require arguments.
- If the Query has any required variables, the Query hook function will require at least one argument: an object that contains all the required variables for the Query.
- If the Query has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Query's variables are optional, the Query hook function does not require any arguments.
- Query hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Query hooks functions can be called with or without passing in an `options` argument of type `useDataConnectQueryOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/query-options).
  - ***Special case:***  If the Query has all optional variables and you would like to provide an `options` argument to the Query hook function without providing any variables, you must pass `undefined` where you would normally pass the Query's variables, and then may provide the `options` argument.

Below are examples of how to use the `default` connector's generated Query hook functions to execute each Query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## GetUser
You can execute the `GetUser` Query using the following Query hook function, which is defined in [default-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetUser(dc: DataConnect, vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUser(vars: GetUserVariables, options?: useDataConnectQueryOptions<GetUserData>): UseDataConnectQueryResult<GetUserData, GetUserVariables>;
```

### Variables
The `GetUser` Query requires an argument of type `GetUserVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that calling the `GetUser` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUser` Query is of type `GetUserData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetUserData {
  user?: {
    id: string;
    email: string;
    name: string;
    createdAt: TimestampString;
  } & User_Key;
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUser`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserVariables } from '@firebasegen/default-connector';
import { useGetUser } from '@firebasegen/default-connector/react'

export default function GetUserComponent() {
  // The `useGetUser` Query hook requires an argument of type `GetUserVariables`:
  const getUserVars: GetUserVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUser(getUserVars);
  // Variables can be defined inline as well.
  const query = useGetUser({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUser(dataConnect, getUserVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUser(getUserVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUser(dataConnect, getUserVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.user);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetUserInfo
You can execute the `GetUserInfo` Query using the following Query hook function, which is defined in [default-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetUserInfo(dc: DataConnect, vars: GetUserInfoVariables, options?: useDataConnectQueryOptions<GetUserInfoData>): UseDataConnectQueryResult<GetUserInfoData, GetUserInfoVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUserInfo(vars: GetUserInfoVariables, options?: useDataConnectQueryOptions<GetUserInfoData>): UseDataConnectQueryResult<GetUserInfoData, GetUserInfoVariables>;
```

### Variables
The `GetUserInfo` Query requires an argument of type `GetUserInfoVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserInfoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `GetUserInfo` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetUserInfo` Query is of type `GetUserInfoData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
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

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetUserInfo`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserInfoVariables } from '@firebasegen/default-connector';
import { useGetUserInfo } from '@firebasegen/default-connector/react'

export default function GetUserInfoComponent() {
  // The `useGetUserInfo` Query hook requires an argument of type `GetUserInfoVariables`:
  const getUserInfoVars: GetUserInfoVariables = {
    id: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUserInfo(getUserInfoVars);
  // Variables can be defined inline as well.
  const query = useGetUserInfo({ id: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUserInfo(dataConnect, getUserInfoVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserInfo(getUserInfoVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserInfo(dataConnect, getUserInfoVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.userInfo);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## GetAllUsers
You can execute the `GetAllUsers` Query using the following Query hook function, which is defined in [default-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetAllUsers(dc: DataConnect, options?: useDataConnectQueryOptions<GetAllUsersData>): UseDataConnectQueryResult<GetAllUsersData, undefined>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetAllUsers(options?: useDataConnectQueryOptions<GetAllUsersData>): UseDataConnectQueryResult<GetAllUsersData, undefined>;
```

### Variables
The `GetAllUsers` Query has no variables.
### Return Type
Recall that calling the `GetAllUsers` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `GetAllUsers` Query is of type `GetAllUsersData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetAllUsersData {
  users: ({
    id: string;
    email: string;
    name: string;
    createdAt: TimestampString;
  } & User_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `GetAllUsers`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@firebasegen/default-connector';
import { useGetAllUsers } from '@firebasegen/default-connector/react'

export default function GetAllUsersComponent() {
  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetAllUsers();

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetAllUsers(dataConnect);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetAllUsers(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetAllUsers(dataConnect, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## getUserByEmail
You can execute the `getUserByEmail` Query using the following Query hook function, which is defined in [default-connector/react/index.d.ts](./index.d.ts):

```javascript
useGetUserByEmail(dc: DataConnect, vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
```
You can also pass in a `DataConnect` instance to the Query hook function.
```javascript
useGetUserByEmail(vars: GetUserByEmailVariables, options?: useDataConnectQueryOptions<GetUserByEmailData>): UseDataConnectQueryResult<GetUserByEmailData, GetUserByEmailVariables>;
```

### Variables
The `getUserByEmail` Query requires an argument of type `GetUserByEmailVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface GetUserByEmailVariables {
  email: string;
}
```
### Return Type
Recall that calling the `getUserByEmail` Query hook function returns a `UseQueryResult` object. This object holds the state of your Query, including whether the Query is loading, has completed, or has succeeded/failed, and any data returned by the Query, among other things.

To check the status of a Query, use the `UseQueryResult.status` field. You can also check for pending / success / error status using the `UseQueryResult.isPending`, `UseQueryResult.isSuccess`, and `UseQueryResult.isError` fields.

To access the data returned by a Query, use the `UseQueryResult.data` field. The data for the `getUserByEmail` Query is of type `GetUserByEmailData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface GetUserByEmailData {
  users: ({
    id: string;
    email: string;
    password: string;
  } & User_Key)[];
}
```

To learn more about the `UseQueryResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useQuery).

### Using `getUserByEmail`'s Query hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, GetUserByEmailVariables } from '@firebasegen/default-connector';
import { useGetUserByEmail } from '@firebasegen/default-connector/react'

export default function GetUserByEmailComponent() {
  // The `useGetUserByEmail` Query hook requires an argument of type `GetUserByEmailVariables`:
  const getUserByEmailVars: GetUserByEmailVariables = {
    email: ..., 
  };

  // You don't have to do anything to "execute" the Query.
  // Call the Query hook function to get a `UseQueryResult` object which holds the state of your Query.
  const query = useGetUserByEmail(getUserByEmailVars);
  // Variables can be defined inline as well.
  const query = useGetUserByEmail({ email: ..., });

  // You can also pass in a `DataConnect` instance to the Query hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const query = useGetUserByEmail(dataConnect, getUserByEmailVars);

  // You can also pass in a `useDataConnectQueryOptions` object to the Query hook function.
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserByEmail(getUserByEmailVars, options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectQueryOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = { staleTime: 5 * 1000 };
  const query = useGetUserByEmail(dataConnect, getUserByEmailVars, options);

  // Then, you can render your component dynamically based on the status of the Query.
  if (query.isPending) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  // If the Query is successful, you can access the data returned using the `UseQueryResult.data` field.
  if (query.isSuccess) {
    console.log(query.data.users);
  }
  return <div>Query execution {query.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

# Mutations

The React generated SDK provides Mutations hook functions that call and return [`useDataConnectMutation`](https://react-query-firebase.invertase.dev/react/data-connect/mutations) hooks from TanStack Query Firebase.

Calling these hook functions will return a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, and the most recent data returned by the Mutation, among other things. To learn more about these hooks and how to use them, see the [TanStack Query Firebase documentation](https://react-query-firebase.invertase.dev/react/data-connect/mutations).

Mutation hooks do not execute their Mutations automatically when called. Rather, after calling the Mutation hook function and getting a `UseMutationResult` object, you must call the `UseMutationResult.mutate()` function to execute the Mutation.

To learn more about TanStack React Query's Mutations, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations).

## Using Mutation Hooks
Here's a general overview of how to use the generated Mutation hooks in your code:

- Mutation hook functions are not called with the arguments to the Mutation. Instead, arguments are passed to `UseMutationResult.mutate()`.
- If the Mutation has no variables, the `mutate()` function does not require arguments.
- If the Mutation has any required variables, the `mutate()` function will require at least one argument: an object that contains all the required variables for the Mutation.
- If the Mutation has some required and some optional variables, only required variables are necessary in the variables argument object, and optional variables may be provided as well.
- If all of the Mutation's variables are optional, the Mutation hook function does not require any arguments.
- Mutation hook functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.
- Mutation hooks also accept an `options` argument of type `useDataConnectMutationOptions`. To learn more about the `options` argument, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/guides/mutations#mutation-side-effects).
  - `UseMutationResult.mutate()` also accepts an `options` argument of type `useDataConnectMutationOptions`.
  - ***Special case:*** If the Mutation has no arguments (or all optional arguments and you wish to provide none), and you want to pass `options` to `UseMutationResult.mutate()`, you must pass `undefined` where you would normally pass the Mutation's arguments, and then may provide the options argument.

Below are examples of how to use the `default` connector's generated Mutation hook functions to execute each Mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#operations-react-angular).

## CreateUser
You can execute the `CreateUser` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [default-connector/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, CreateUserVariables>): UseDataConnectMutationResult<CreateUserData, CreateUserVariables>;
```

### Variables
The `CreateUser` Mutation requires an argument of type `CreateUserVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface CreateUserVariables {
  email: string;
  name: string;
  password: string;
  phone?: string | null;
}
```
### Return Type
Recall that calling the `CreateUser` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUser` Mutation is of type `CreateUserData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUserData {
  user_insert: User_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUser`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateUserVariables } from '@firebasegen/default-connector';
import { useCreateUser } from '@firebasegen/default-connector/react'

export default function CreateUserComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUser();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUser(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUser(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateUser` Mutation requires an argument of type `CreateUserVariables`:
  const createUserVars: CreateUserVariables = {
    email: ..., 
    name: ..., 
    password: ..., 
    phone: ..., // optional
  };
  mutation.mutate(createUserVars);
  // Variables can be defined inline as well.
  mutation.mutate({ email: ..., name: ..., password: ..., phone: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createUserVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.user_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## CreateUserInfo
You can execute the `CreateUserInfo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [default-connector/react/index.d.ts](./index.d.ts)):
```javascript
useCreateUserInfo(options?: useDataConnectMutationOptions<CreateUserInfoData, FirebaseError, CreateUserInfoVariables>): UseDataConnectMutationResult<CreateUserInfoData, CreateUserInfoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useCreateUserInfo(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserInfoData, FirebaseError, CreateUserInfoVariables>): UseDataConnectMutationResult<CreateUserInfoData, CreateUserInfoVariables>;
```

### Variables
The `CreateUserInfo` Mutation requires an argument of type `CreateUserInfoVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `CreateUserInfo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `CreateUserInfo` Mutation is of type `CreateUserInfoData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface CreateUserInfoData {
  userInfo_insert: UserInfo_Key;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `CreateUserInfo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, CreateUserInfoVariables } from '@firebasegen/default-connector';
import { useCreateUserInfo } from '@firebasegen/default-connector/react'

export default function CreateUserInfoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useCreateUserInfo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useCreateUserInfo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUserInfo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useCreateUserInfo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useCreateUserInfo` Mutation requires an argument of type `CreateUserInfoVariables`:
  const createUserInfoVars: CreateUserInfoVariables = {
    userId: ..., 
    activityFactor: ..., // optional
    age: ..., // optional
    gender: ..., // optional
    height: ..., // optional
    weight: ..., // optional
  };
  mutation.mutate(createUserInfoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ userId: ..., activityFactor: ..., age: ..., gender: ..., height: ..., weight: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(createUserInfoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userInfo_insert);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## UpdateUserInfo
You can execute the `UpdateUserInfo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [default-connector/react/index.d.ts](./index.d.ts)):
```javascript
useUpdateUserInfo(options?: useDataConnectMutationOptions<UpdateUserInfoData, FirebaseError, UpdateUserInfoVariables>): UseDataConnectMutationResult<UpdateUserInfoData, UpdateUserInfoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useUpdateUserInfo(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateUserInfoData, FirebaseError, UpdateUserInfoVariables>): UseDataConnectMutationResult<UpdateUserInfoData, UpdateUserInfoVariables>;
```

### Variables
The `UpdateUserInfo` Mutation requires an argument of type `UpdateUserInfoVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
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
Recall that calling the `UpdateUserInfo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `UpdateUserInfo` Mutation is of type `UpdateUserInfoData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface UpdateUserInfoData {
  userInfo_update?: UserInfo_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `UpdateUserInfo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, UpdateUserInfoVariables } from '@firebasegen/default-connector';
import { useUpdateUserInfo } from '@firebasegen/default-connector/react'

export default function UpdateUserInfoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useUpdateUserInfo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useUpdateUserInfo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserInfo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useUpdateUserInfo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useUpdateUserInfo` Mutation requires an argument of type `UpdateUserInfoVariables`:
  const updateUserInfoVars: UpdateUserInfoVariables = {
    id: ..., 
    activityFactor: ..., // optional
    age: ..., // optional
    gender: ..., // optional
    height: ..., // optional
    weight: ..., // optional
  };
  mutation.mutate(updateUserInfoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., activityFactor: ..., age: ..., gender: ..., height: ..., weight: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(updateUserInfoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userInfo_update);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

## DeleteUserInfo
You can execute the `DeleteUserInfo` Mutation using the `UseMutationResult` object returned by the following Mutation hook function (which is defined in [default-connector/react/index.d.ts](./index.d.ts)):
```javascript
useDeleteUserInfo(options?: useDataConnectMutationOptions<DeleteUserInfoData, FirebaseError, DeleteUserInfoVariables>): UseDataConnectMutationResult<DeleteUserInfoData, DeleteUserInfoVariables>;
```
You can also pass in a `DataConnect` instance to the Mutation hook function.
```javascript
useDeleteUserInfo(dc: DataConnect, options?: useDataConnectMutationOptions<DeleteUserInfoData, FirebaseError, DeleteUserInfoVariables>): UseDataConnectMutationResult<DeleteUserInfoData, DeleteUserInfoVariables>;
```

### Variables
The `DeleteUserInfo` Mutation requires an argument of type `DeleteUserInfoVariables`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:

```javascript
export interface DeleteUserInfoVariables {
  id: UUIDString;
}
```
### Return Type
Recall that calling the `DeleteUserInfo` Mutation hook function returns a `UseMutationResult` object. This object holds the state of your Mutation, including whether the Mutation is loading, has completed, or has succeeded/failed, among other things.

To check the status of a Mutation, use the `UseMutationResult.status` field. You can also check for pending / success / error status using the `UseMutationResult.isPending`, `UseMutationResult.isSuccess`, and `UseMutationResult.isError` fields.

To execute the Mutation, call `UseMutationResult.mutate()`. This function executes the Mutation, but does not return the data from the Mutation.

To access the data returned by a Mutation, use the `UseMutationResult.data` field. The data for the `DeleteUserInfo` Mutation is of type `DeleteUserInfoData`, which is defined in [default-connector/index.d.ts](../index.d.ts). It has the following fields:
```javascript
export interface DeleteUserInfoData {
  userInfo_delete?: UserInfo_Key | null;
}
```

To learn more about the `UseMutationResult` object, see the [TanStack React Query documentation](https://tanstack.com/query/v5/docs/framework/react/reference/useMutation).

### Using `DeleteUserInfo`'s Mutation hook function

```javascript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, DeleteUserInfoVariables } from '@firebasegen/default-connector';
import { useDeleteUserInfo } from '@firebasegen/default-connector/react'

export default function DeleteUserInfoComponent() {
  // Call the Mutation hook function to get a `UseMutationResult` object which holds the state of your Mutation.
  const mutation = useDeleteUserInfo();

  // You can also pass in a `DataConnect` instance to the Mutation hook function.
  const dataConnect = getDataConnect(connectorConfig);
  const mutation = useDeleteUserInfo(dataConnect);

  // You can also pass in a `useDataConnectMutationOptions` object to the Mutation hook function.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUserInfo(options);

  // You can also pass both a `DataConnect` instance and a `useDataConnectMutationOptions` object.
  const dataConnect = getDataConnect(connectorConfig);
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  const mutation = useDeleteUserInfo(dataConnect, options);

  // After calling the Mutation hook function, you must call `UseMutationResult.mutate()` to execute the Mutation.
  // The `useDeleteUserInfo` Mutation requires an argument of type `DeleteUserInfoVariables`:
  const deleteUserInfoVars: DeleteUserInfoVariables = {
    id: ..., 
  };
  mutation.mutate(deleteUserInfoVars);
  // Variables can be defined inline as well.
  mutation.mutate({ id: ..., });

  // You can also pass in a `useDataConnectMutationOptions` object to `UseMutationResult.mutate()`.
  const options = {
    onSuccess: () => { console.log('Mutation succeeded!'); }
  };
  mutation.mutate(deleteUserInfoVars, options);

  // Then, you can render your component dynamically based on the status of the Mutation.
  if (mutation.isPending) {
    return <div>Loading...</div>;
  }

  if (mutation.isError) {
    return <div>Error: {mutation.error.message}</div>;
  }

  // If the Mutation is successful, you can access the data returned using the `UseMutationResult.data` field.
  if (mutation.isSuccess) {
    console.log(mutation.data.userInfo_delete);
  }
  return <div>Mutation execution {mutation.isSuccess ? 'successful' : 'failed'}!</div>;
}
```

