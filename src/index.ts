import { BasketData, GaleryChangeEvent, OrderData, ProductsData } from './components/AppState';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/basket';
import { Card } from './components/card';
import { LarekAPI } from './components/larekAPI';
import { Modal } from './components/modal';
import { OrderInfo, UserInfo } from './components/order';
import { Page } from './components/page';
import { Success } from './components/success';
import './scss/styles.scss';
import {IOrder, IProduct, TOrderInfo} from './types';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { ensureElement, createElement, cloneTemplate} from './utils/utils';


// шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalContainer = ensureElement<HTMLElement>('.modal');


const events = new EventEmitter;
const api = new LarekAPI(CDN_URL ,API_URL);
const products = new ProductsData({}, events);
const page = new Page(document.body, events);
const basket = new BasketData({}, events);
const modal = new Modal(modalContainer, events);
const orderInfo = new OrderInfo(cloneTemplate(orderFormTemplate), events);
const userInfo = new UserInfo(cloneTemplate(contactsFormTemplate), events);
const orderData = new OrderData({}, events);
const basketModal = new Basket(cloneTemplate(basketTemplate), events);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
  console.log(eventName, data);
})

events.on<GaleryChangeEvent>('items:changed', () => {
  page.galeryItems = products.productList.map(item => {
      const card = new Card('card', cloneTemplate(cardCatalogTemplate), 
      {
        onClick: () => events.emit('card:select', item)
      });

      return card.render({
          title: item.title,
          image: item.image,
          price: item.price,
          category: item.category
      });
  });
})

events.on('preview:change', () => {
  const cardInfo = products.getSelectedCard();
  const card = new Card('card', cloneTemplate(cardPreviewTemplate),
  {
    onClick: () => { 
      basket.checkProductId(products.getSelectedCard())
      if(!basket.added) {
      events.emit('card:add');
      card.setText(card.button, 'Удалить из корзины')
    } else {
      events.emit('card:remove');
      card.setText(card.button, 'В корзину')
      }
    }
  });

  basket.checkProductId(products.getSelectedCard());
  if(cardInfo.price === null) {
    card.setText(card.button, 'Это подарок судьбы!')
    card.setDisabled(card.button, true)
  }
  if(basket.added) {
    card.setText(card.button, 'Удалить из корзины')
  }

  const cardPreview = card.render(
    {
      title: cardInfo.title,
      image: cardInfo.image,
      price: cardInfo.price,
      category: cardInfo.category,
      description: cardInfo.description
    }
  )

  modal.render({
    content: cardPreview
  })
})

events.on('card:select', (selectCard: IProduct) => {
  products.productId = selectCard.id;
})

events.on('card:add', () => {
  basket.addProduct(products.getSelectedCard());
})

events.on('card:remove', () => {
  basket.deleteProduct(products.getSelectedCard());
})

events.on('modal:open', () => {
  page.locked = true;
});

events.on('modal:close', () => {
  page.locked = false;
});

events.on('basketProduct:change',() => {
  page.counter = basket.basketCardsInfo.length
})

events.on('basket:open', () => {
  const basketCards: HTMLElement[] = basket.basketCardsInfo.map(item => {
    const card = new Card('card', cloneTemplate(cardBasketTemplate), {
    onClick: () => {
       events.emit('card:select', item);
       basket.checkProductId(products.getSelectedCard())
       if(basket.added) {
        events.emit('card:remove');
       }
       events.emit('basket:open');
    }
  });
  
    return card.render({
      title: item.title,
      price: item.price,
      index: basket.basketCardsInfo.indexOf(item) + 1
    })
  })

   modal.render({
     content: basketModal.render({
        items: basketCards,
        total: basket.getTotalPrice()
  })
   })
});

events.on('formErrors:change', (errors: Partial<TOrderInfo>) => {
  const {email, phone, address, payment} = errors;
  orderInfo.valid = !address && !payment;
  orderInfo.errors = Object.values({address, payment}).filter(i => !!i).join('; ');
  userInfo.valid = !email && !phone;
  userInfo.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof TOrderInfo, value: string }) => {
  orderData.setOrderField(data.field, data.value);
});

events.on(/^contacts\..*:change/, (data: { field: keyof TOrderInfo, value: string }) => {
  orderData.setOrderField(data.field, data.value);
});

// Открыть форму заказа
events.on('order:open', () => {
  modal.render({
      content: orderInfo.render({
          address: orderData.order.address,
          valid: false,
          errors: []
      })
  });
});

events.on('order:submit', () => {
  modal.render({
    content: userInfo.render({
        phone: orderData.order.phone,
        email: orderData.order.email,
        valid: false,
        errors: []
    })
  });
})

events.on('contacts:submit', () => {

  const fullOrder = orderData.order as IOrder
  fullOrder.total = basket.getTotalPrice();
  fullOrder.items = basket.getBasketProductsId();

  api.orderProduct(fullOrder)
  .then(res => {
    basket.resetProductBasket();
    orderData.resetOrderInfo();
    const success = new Success(cloneTemplate(successTemplate), {
      onClick: () => {
        modal.close();
      }
    })
    modal.render({
      content: success.render({total:res.total})
    })
  })
  .catch(err => {
    console.log(err)
    modal.render({
    content: createElement<HTMLParagraphElement>('p', {
      textContent: 'Ой! Ошибка на сервере, мы уже работаем над этим!'
        })
      })
    }
  );
})

api.getProductList()
.then(res => {
  products.productList = res.items;
}
  )
.catch(err => {
    console.error(err);
    modal.render({
      content: createElement<HTMLParagraphElement>('p', {
        textContent: 'Не удалось загрузить карточки товара, но мы уже работаем над этим!'
      })
    })
});

