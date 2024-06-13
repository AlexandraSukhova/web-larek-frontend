import { IEvents } from "../components/base/events";

//типы данных
export interface IProduct {
  id: string,
  title: string,
  description: string,
  image: string,
  category: TCategory,
  price: number | null
} // Полная инфомация о товаре

export interface IOrder {
  payment: string,
  email: string,
  phone: string,
  address: string,
  total: number | null,
  items: string[]
} // то как это должна уходить на сервер информация о пользователе + информация о покупке

export type TCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'

export type TBasketMessage = 'Товар успешно добавлен в корзину' | 'Товар успешно удален из корзины' | 'Ошибка! Товар уже находится в корзине' | 'Ошибка! Товар отстутсвует в корзине'

export type TPayment = 'cash' | 'card';

export type TOrderInfo = Pick<IOrder, 'address' | 'email' | 'phone' | 'payment'>;

export type FormErrors = Partial<Record<keyof TOrderInfo, string>>;
