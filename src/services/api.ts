import axios from "services/axios.customize";
export const loginAPI = (username: string, password: string) => {
  const urlBackEnd = "/api/v1/auth/login";
  return axios.post<IBackendRes<ILogin>>(
    urlBackEnd,
    { username, password },
    {
      headers: {
        delay: 3000,
      },
    }
  );
};

export const registerAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: number
) => {
  const urlBackEnd = "/api/v1/user/register";
  return axios.post<IBackendRes<IRegister>>(urlBackEnd, {
    fullName,
    email,
    password,
    phone,
  });
};

export const fetchAccountAPI = () => {
  const urlBackEnd = "/api/v1/auth/account";
  return axios.get<IBackendRes<IFetchAccount>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};

export const logoutAPI = () => {
  const urlBackEnd = "/api/v1/auth/logout";
  return axios.post<IBackxendRes>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};
export const createUserAPI = (
  fullName: string,
  email: string,
  password: string,
  phone: string
) => {
  const urlBackEnd = "/api/v1/user";
  const data = {
    fullName,
    email,
    password,
    phone,
  };
  return axios.post<IBackendRes>(urlBackEnd, data, {
    headers: {
      delay: 1000,
    },
  });
};
export const getUserAPI = (query: string) => {
  const urlBackEnd = `/api/v1/user?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};
// export const getUserAPI = (query: string) => {
//   const urlBackEnd = `/api/v1/user?${query}`;
//   return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(urlBackEnd, {
//     headers: {
//       delay: 1000,
//     },
//   });
// };
