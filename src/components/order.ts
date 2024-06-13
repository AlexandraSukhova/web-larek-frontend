import {Form} from "./form";
import {IOrder} from "../types";
import {IEvents} from "./base/events";
import {ensureAllElements, ensureElement} from "../utils/utils";


export class OrderInfo extends Form<IOrder> {
  protected _buttonContainer: HTMLElement;
  protected _buttons: HTMLButtonElement[];

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this._buttonContainer = ensureElement<HTMLElement>('.order__buttons', this.container);
    this._buttons = ensureAllElements<HTMLButtonElement>('.button', this._buttonContainer);

    this._buttons.forEach(button => button.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLButtonElement;
      const field = 'payment';
      const value = target.name;
      this.onButtonChange(value, field);
      events.emit('check:buttonState');
        }
      )
    )
  }

  protected onButtonChange(value: string, field: string) {
    this.events.emit(`${this.container.name}.${field}:change`, {
      field,
      value
    });
  }

  setButtonState(buttonOneName: string, buttonTwoName: string, activeClass: string) {
    const buttonOne: HTMLButtonElement = this._buttonContainer.querySelector(`[name=${buttonOneName}]`);
    const buttonTwo: HTMLButtonElement = this._buttonContainer.querySelector(`[name=${buttonTwoName}`);
    this.toggleClass(buttonOne, activeClass);
    this.toggleClass(buttonTwo, activeClass);
  }

  set payment(value: string) {
  (this.container.elements.namedItem('payment') as HTMLButtonElement).name = value;
  }

  set address(value: string) {
    (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}

export class UserInfo extends Form<IOrder> {
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
}

  set phone(value: string) {
  (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
}

  set email(value: string) {
  (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
}
}