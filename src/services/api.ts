import { Content } from "antd/es/layout/layout";
import { url } from "inspector";
import { post } from "node_modules/axios/index.d.cts";
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
export const updateUserAPI = (_id: string, fullName: string, phone: string) => {
  const urlBackEnd = "/api/v1/user";
  const data = {
    _id,
    fullName,
    phone,
  };
  return axios.put<IBackendRes>(urlBackEnd, data, {
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
export const deleteUserAPI = (_id: string) => {
  const urlBackEnd = `/api/v1/user/${_id}`;
  return axios.delete<IBackendRes<IModelPaginate<IUserTable>>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};
export const bulkCreateUserAPI = (values: IDataImport[]) => {
  const urlBackEnd = `/api/v1/user/bulk-create`;
  const passWord = "123456";
  const newValues = values.map((item) => ({
    ...item,
    password: passWord,
  }));
  const data = newValues;
  return axios.post<IBackendRes>(urlBackEnd, data, {
    headers: {
      delay: 1000,
    },
  });
};

//Book API

export const getBookAPI = (query: string) => {
  const urlBackEnd = `/api/v1/book?${query}`;
  return axios.get<IBackendRes<IModelPaginate<IBookTable>>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};
export const getCategoryAPI = () => {
  const urlBackEnd = "/api/v1/database/category";
  return axios.get<IBackendRes<string[]>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};

export const callUploadImg = (fileImg: any, folder: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("fileImg", fileImg);
  return axios<IBackendRes<{ fileUploaded: string }>>({
    method: "post",
    url: "/api/v1/file/upload",
    data: bodyFormData,
    headers: {
      Content: "multipart/form-data",
      "upload-type": folder,
    },
  });
};

export const createBookAPI = (
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: string,
  quantity: string,
  category: string
) => {
  const urlBackEnd = "/api/v1/book";

  return axios.post<IBackendRes>(urlBackEnd, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};

export const updateBookAPI = (
  id: string,
  thumbnail: string,
  slider: string[],
  mainText: string,
  author: string,
  price: string,
  quantity: string,
  category: string
) => {
  const urlBackEnd = `/api/v1/book/${id}`;
  return axios.put<IBackendRes>(urlBackEnd, {
    thumbnail,
    slider,
    mainText,
    author,
    price,
    quantity,
    category,
  });
};

export const deleteBookAPI = (id: string) => {
  const urlBackEnd = `/api/v1/book/${id}`;
  return axios.delete<IBackendRes<IModelPaginate<IBookTable>>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};

export const fetchBookById = (id: string) => {
  const urlBackEnd = `/api/v1/book/${id}`;
  return axios.get<IBackendRes<IBookTable>>(urlBackEnd, {
    headers: {
      delay: 1000,
    },
  });
};
