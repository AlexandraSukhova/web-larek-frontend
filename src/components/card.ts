import { Component } from './base/Component';
import { ensureElement} from '../utils/utils';


interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard<T> {
  title: string;
  description?: string | string[];
  image?: string;
  price: number | null;
  category?: string;
  index?: number;
}

export class Card<T> extends Component<ICard<T>> {
  protected _title: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _description?: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _price: HTMLElement;
  protected _category?: HTMLElement;
  protected _index?: HTMLElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
      super(container);

      this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
      this._image = container.querySelector(`.${blockName}__image`);
      this._button = container.querySelector(`.${blockName}__button`);
      this._description = container.querySelector(`.${blockName}__text`);
      this._price = container.querySelector(`.${blockName}__price`);
      this._category = container.querySelector(`.${blockName}__category`);
      this._index = container.querySelector(`.basket__item-index`);

      if (actions?.onClick) {
          if (this._button) {
              this._button.addEventListener('click', actions.onClick);
          } else {
              container.addEventListener('click', actions.onClick);
          }
      }
  }

  get button() {
    if(this._button) {
      return this._button
    }
  }

  set index(value: number) {
    this._index.textContent = String(value);
  }

  set id(value: string) {
      this.container.dataset.id = value;
  }

  get id(): string {
      return this.container.dataset.id || '';
  }

  set title(value: string) {
      this.setText(this._title, value);
  }

  get title(): string {
      return this._title.textContent || '';
  }

  set price(value: number | null) {
    if(value !== null) {
      this.setText(this._price, `${value} синапсов`);
    } else {
      this.setText(this._price, 'бесценно');
    }
  }

  set category(value: string) {
    this.setText(this._category, value);
  }

  setCategoryColor(value: string) {
    this._category.classList.add(`${this.blockName}__category_${value}`);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title)
}

  set description(value: string) {
          this.setText(this._description, value);
      }
}