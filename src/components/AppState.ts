import { Model } from './base/Model';
import { IProduct, TPayment, TOrderInfo, IOrder, FormErrors, TBasketMessage} from '../types';

export type GaleryChangeEvent = {
  productCards: IProduct[]
};

export class ProductsData extends Model<IProduct> {
  protected productCards: IProduct[] | null;
  protected preview: string | null;
  //Сохранить в поле класса массив всех карточек
    set productList(info: IProduct[]) {
      this.productCards = info;
      this.emitChanges('items:changed', {catalog: this.productCards });
    }
  //Получить из поля класса массив каталога всех карточек
    get productList(){
      return this.productCards;
    }
  //Сохранить id выбранной карточки в поле класса
    set productId(id: string) {
      this.preview = id;
      this.emitChanges('preview:change', this.getSelectedCard);
    }
  //Получить id выбранной карточки
    get productId() {
      return this.preview;
    }
  //Получить объект с одной выбранной карточкой
    getSelectedCard(): IProduct {
      const selectedCard = this.productCards.find(card => card.id === this.preview);
      return selectedCard
    }
  }
  
  export class BasketData extends Model<IProduct>{
  basketCards: IProduct[] = [];
  added: boolean;
  
    get basketCardsInfo() {
      return this.basketCards;
    }
  
    deleteProduct(product: IProduct): void {
      this.checkProductId(product);
      if(this.added) {
        this.basketCards = this.basketCards.filter(card => card.id !== product.id);
      }
        this.emitChanges('basketProduct:change', this.basketCards)
    }
  
    addProduct(product: IProduct): void {
      this.checkProductId(product);
      if(!this.added) {
        this.basketCards.push(product);
      }
        this.emitChanges('basketProduct:change', this.basketCards)
    }
  
    checkProductId(product: IProduct): boolean {
      this.added = false;
      this.basketCards.forEach(card => {
        if(card.id === product.id) {
          this.added = true;
        }
      })
      return this.added;
    }
  
    getTotalPrice(): number | null {
      let total: number = 0;
      this.basketCards.forEach(card => {
        total = total + card.price;
      })
  
      return total;
    }
  
    getBasketProductsId(): string[] {
      const idList: string[] = [];
      this.basketCards.forEach(card => idList.push(String(card.id)));
      return idList
    }
  
    resetProductBasket(): void {
        this.basketCards.splice(0, this.basketCards.length);
        this.emitChanges('basketProduct:change', this.basketCards);
    }
  }
  
  export class OrderData extends Model<IOrder>{
    order: TOrderInfo = {
      payment: 'card',
      email: '',
      phone: '',
      address: ''
    };
    formErrors: FormErrors = {};
  
    set orderPayment(payment: TPayment) {
      this.order.payment = payment;
    }

    setOrderField(field: keyof TOrderInfo, value: string) {
      this.order[field] = value;
  
      if (this.validateOrder() && this.validateUser()) {
          this.events.emit('order:ready', this.order);
      }
  }
  
    validateOrder() {
      const errors: typeof this.formErrors = {};
      if(!this.order.payment) {
        errors.payment = 'Необходимо указать способ оплаты';
      }
      if (!this.order.address) {
        errors.address = 'Необходимо указать адрес';
      }
      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
    }

    validateUser() {
      const errors: typeof this.formErrors = {};
      if (!this.order.email) {
          errors.email = 'Необходимо указать email';
      }
      if (!this.order.phone) {
          errors.phone = 'Необходимо указать телефон';
      }
      this.formErrors = errors;
      this.events.emit('formErrors:change', this.formErrors);
      return Object.keys(errors).length === 0;
    }

    resetOrderInfo() {
      this.order.payment = 'card';
      this.order.address = '';
      this.order.email = '';
      this.order.phone = '';
      }
  }