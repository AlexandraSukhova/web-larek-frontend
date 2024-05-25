import { IEvents } from "../components/base/events";

//типы данных
export interface IProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number | null;
} // то как приходит с сервера инфомация о товаре

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

export type TBasketProduct = Pick<IProduct, 'id' | 'price' | 'title'>; // тип данных для отображения списка карточек в корзине

export type TBasketInfo = Pick<IOrder, 'items' | 'total'>; // тип данных для отображения в корзине

export type TOrderInfo = Pick<IOrder, 'payment' | 'address'>; // тип данных для модального окна выбор оплаты/адресс

export type TUserInfo = Pick<IOrder, 'phone' | 'email'>; // тип данных для модального окна информация о покупателе телефон/почта

export type TOrderSuccess = Pick<IOrder, 'total'>; // тип данных для модального окна успешного заказа

// интерфейсы модели данных
export interface IProductData {
  productCards: IProduct[];
  //массив карточек
  preview: TProductSelected | null;
  //выбранная для просмотра карточка
  basketProducts: TProductSelected[];
  //карточки в корзине
  getCard(productId: TProductSelected): IProduct;
  //получить карточку по id
  addProduct(product: TProductSelected, payload: Function | null): void;
  //добавить карточку в корзину
  deleteProduct(product: TProductSelected, payload: Function | null): void;
  //удалить карточку из корзины
  checkProductId(id: TProductSelected, basketList: TProductSelected[]): boolean;
  //валидация id перед добавлением в корзину
}

export interface IOrderData {
  getUserInfo(): TUserInfo;
  getOrderInfo(): TOrderInfo;
  getBasketInfo(): TBasketInfo;
  setFullOrderInfo(userData: IOrder): void;
  checkOrderValidation(data: Record<keyof TOrderInfo, string>): boolean;
  checkUserInfo(data: Record<keyof TUserInfo, string>): boolean;
}

export interface IBasketData {
  basketCards: TBasketProduct[];
  selected: TProductSelected | null;
  getTotalPrice(prices: number[]): number;
  deleteProduct(product: TProductSelected, payload: Function | null): void;
}

//интерфейсы отображения данных

export interface IPage {
  basketCount: HTMLElement;
  count: number;
  galeryList: HTMLUListElement;
  render(card: HTMLElement): void;
}

export interface IModal {
  modal: HTMLElement;
  events: IEvents;
  addConten(elem: HTMLTemplateElement): void;
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
  total: number;
  totalOrderPrice: HTMLElement;
  submitButton: HTMLButtonElement;
  closeModal(): void;
}

export interface IProductModal extends IModal {
  addButton: HTMLButtonElement;
  addButtonText: string;
  deleteButtonText: string;
  checkButtonStatus(): boolean;
}

export interface IGalleryCard {
  productItem: HTMLTemplateElement;
  productTitle: HTMLElement;
  productImage: HTMLImageElement;
  productPrice: HTMLElement;
  setProductInfo(userData: IProduct): void;
  render(): HTMLElement;
  selectedCard(): string;
}

export interface IfullCard extends IGalleryCard {
  productDescription: HTMLElement;
  addProduct(): void;
  deleteProduct(): void;
  render(): HTMLElement;
}

export interface IbasketCard {
  productItem: HTMLTemplateElement;
  productTitle: HTMLElement;
  productPrice: HTMLElement;
  deleteButtton: HTMLButtonElement;
  setData(cardData: TBasketProduct): void;
  deleteProductCard(): void;
  render(): HTMLElement;
}
