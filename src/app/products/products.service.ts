import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Product } from '../product/product';

@Injectable()
export class ProductsService {

  private productsUrl = 'https://sephora-api-frontend-test.herokuapp.com/products';  // URL to web api
  public totalProductsCount = 0;

  constructor(private http: Http) { }

  /***
  @function getProducts
  @desc: get list products
  @params: null
  @return array of Product model
  ***/
  getProducts(): Promise<Product[]> {
    return this.http.get(this.productsUrl)
               .toPromise()
               .then(response => {
                  this.totalProductsCount = response.json().links;
                  return response.json().data as Product[];
                })
               .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
