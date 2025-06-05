export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ILogin {
    access_token: string;
    user: {
      email: string;
      phone: string;
      fullName: string;
      role: string;
      avatar: string;
      id: string;
    };
  }
  interface IRegister {
    _id: string;
    email: string;
    fullname: string;
  }
  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }
  interface IFetchAccount {
    user: IUser;
  }
  interface IUserTable {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  interface IBookTable {
    _id: string;
    thumbnail: string;
    slider: [];
    mainText: string;
    author: string;
    price: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    __v: 0;
  }
  interface IHistory {
    _id: string;
    name: string;
    address: string;
    type: string;
    email: string;
    phone: string;
    userId: string;
    detail: [
      {
        bookName: string;
        quantity: number;
        _id: string;
      }
    ];
    totalPrice: number;
    paymentStatus: string;
    paymentRef: string;
    createdAt: string;
    updatedAt: string;
    __v: 0;
  }
  interface IDataImport {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }
  interface ICart {
    id: string;
    quantity: number;
    detail: IBookTable;
  }

  interface IOrderTable extends IHistory {}

  interface IDashBoard {
    countOrder: number;
    countUser: number;
    countBook: number;
  }
}
