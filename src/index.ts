import { Api, ApiListResponse } from './components/base/api';
import './scss/styles.scss';
import { IProduct } from './types';
import { ensureElement } from './utils/utils';




// шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCaatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
