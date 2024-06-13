import { IOrder, IProduct } from "../types";
import { Api, ApiListResponse } from "./base/api";


export interface ILarekAPI {
  getProductList: () => Promise<ApiListResponse<IProduct>>;
  orderProduct: (order: IOrder) => Promise<IOrder>;
}

export class LarekAPI extends Api implements ILarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
}

  getProductList(): Promise<ApiListResponse<IProduct>> {
    return this.get('/product').then((data: ApiListResponse<IProduct>) => {
      data.items.forEach(item => item.image = this.cdn + item.image)
      return data
      }
    );
  }

  orderProduct(order: IOrder): Promise<IOrder> {
    return this.post('/order', order).then(
        (data: IOrder) => data
    );
  }
}