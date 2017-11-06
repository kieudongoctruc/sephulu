import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Product } from './product';

@Injectable()
export class ProductService {

  private productUrl = 'https://sephora-api-frontend-test.herokuapp.com/products/';  // URL to web api

  constructor(private http: Http) { }

  /***
  @function getProduct
  @desc: get detail information of a product
  @params: id
  @return product object
  ***/
  getProduct(id: number): Promise<Product> {
    const url = `${this.productUrl}/${id}`;
    return this.http.get(url)
               .toPromise()
               .then(response => response.json().data as Product)
               .catch(this.handleError);
  }

  /***
  @function handleError
  @desc: if the request failed, this functions is called
  @params: error
  @return error as Promise
  ***/
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
