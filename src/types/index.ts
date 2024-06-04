import { IEvents } from "../components/base/events";

//типы данных
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
} // Полная инфомация о товаре

export interface IOrder {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: TProductSelected[];
} // то как это должна уходить на сервер информация о пользователе + информация о покупке

export type TPayment = 'cash' | 'card'; // тип данных для выбора способа оплаты

export type TProductSelected = Pick<IProduct, 'id'> // тип данных для выбранного товара

export type TBasketInfo = Pick<IOrder, 'items' | 'total'>; // тип данных для отображения в корзине

export type TBasketProduct = Pick<IProduct, 'title' | 'price' | 'id'>; //тип данных для отображения товара карточки в корзине

export type TGaleryProduct = Pick<IProduct, 'category' | 'title' | 'id' | 'image' | 'price'>; //тип данных для отображения карточки в галерее

export type TOrderInfo = Pick<IOrder, 'payment' | 'address' | 'email' | 'phone'>; // тип данных для хранения информации о покупателе

export type TOrderInfoForm = Pick<IOrder, 'address' | 'payment'>;// тип данных для формы ввода адреса и способа оплаты

export type TUserInfoForm = Pick<IOrder, 'email' | 'phone'>;// типа данных для формы ввода телефона и почты

export type TOrderSuccess = Pick<IOrder, 'total'>; // тип данных для модального окна успешного заказа

// интерфейсы модели данных
export interface IProductData {
  productCards: IProduct[];  //Массив карточек
  preview: TProductSelected | null;  //Id выбранной карточки
  getCard(productId: TProductSelected): IProduct;  //Получить информацию о выбранной карточке по id из массива всех карточек
  getProductList(): IProduct[];  //Получить массив всех карточек продукта с сервера в определенном формате
}

export interface IOrderData {
  payment: TPayment //способ оплаты товара 
  email: string //электронная почта покупателя 
  phone: string //номер телефона покупателя 
  address: string //адресс покупателя
  getOrderInfo(orderInfo: TOrderInfo, productInfo: TProductSelected[]): IOrder; //получает данные пользователя о заказе
  setFullOrderInfo(userData: IOrder): void; //отправляет данные о заказе в определенном формате на сервер (покупка)
  checkOrderValidation(data: Record<keyof TOrderInfo, string>): boolean; // проверяет валидность введенных данных
}

export interface IBasketData {
  basketCards: TProductSelected[];  //список id добавленных в корзину карточек
  getTotalPrice(prices: number[]): number;  //получение общей суммы суммы заказа
  checkProductId(id: TProductSelected, basketList: TProductSelected[]): boolean;  //проверяет id карточек при добавлении в корзину
  resetProductBasket(): void;  //удаление id всех товаров из списка корзины после успешного оформления заказа
}

//интерфейсы отображения данных

export interface IPage {
  basketCount: HTMLElement;
  galeryList: HTMLUListElement;
  render(card: HTMLElement[] | null): void;
}

export interface IModal {
  modal: HTMLElement;
  events: IEvents;
  addConten(elem: HTMLElement): void;
  openModal(): void;
  closeModal(): void;
}

export interface IFormModal extends IModal {
  inputs: NodeListOf<HTMLInputElement>;
  submitButton: HTMLButtonElement;
  form: HTMLFormElement;
  formName: string;
  errors: Record<string, HTMLElement>;
  setValid(isValid: boolean): string;
  getInputValues(): Record<string, string>;
  setErrors(data: { field: string, value: string, validInformation: string }): void;
  showInputError (field: string, errorMessage: string): void;
  hideInputError (field: string): void;
  closeModal (): void
}

export interface IBasketModal extends IModal {
  productList: HTMLUListElement;
  totalBasketPrice: HTMLElement;
  submitButton: HTMLButtonElement;
  render(cards: HTMLElement): void;
}

export interface ISuccessModal extends IModal {
  totalOrderPrice: HTMLElement;
  submitButton: HTMLButtonElement;
  closeModal(): void;
}

