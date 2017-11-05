import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Product } from '../product/product';

@Injectable()
export class ProductsService {

  private productsUrl = 'https://sephora-api-frontend-test.herokuapp.com/products';  // URL to web api
  public totalProductsCount = 0;

  priceFilterOptions = {
    0: { lt: 2500 },
    1: { ht: 2500, lt: 5000 },
    2: { ht: 5000, lt: 10000 },
    3: { ht: 10000, lt: 15000 },
    4: { ht: 15000, lt: 30000 },
    5: { ht: 30000 }
  }

  constructor(private http: Http) { }

  /***
  @function getProducts
  @desc: get list products
  @params: null
  @return array of Product model
  ***/
  getProducts(queryParams = {}): Promise<Product[]> {
    let queryString = this.createQueryString(queryParams);
    let url = this.productsUrl + '?' + queryString;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                  this.totalProductsCount = response.json().links;
                  return response.json().data as Product[];
                })
               .catch(this.handleError);
  }

  private createQueryString(queryParams) {
    console.log(queryParams);
    let query = [];
    for (let key in queryParams) {
      let value = queryParams[key];
      let params = [];
      switch(key) {
        case 'price':
          params = this.createPriceQueryString(value);
          break;
        case 'category':
          params = [`filter[category_in]=${value}`];
          break;
        case 'sort':
          params = value.length == 0 ? [''] : [`sort=${value}`];
          break;
        case 'view':
          params = value.length == 0 ? [''] : [`page[size]=${value}`];
          break;
      }
      query.push(params);
    }
    //flatten array of arrays
    query = [].concat.apply([], query);
    //remove empty elements
    query = query.filter(function(n) { return n != '' });
    //join all elements to be a completed string
    console.log(query.join('&'));
    // query = query.join('&');
    return query.join('&');
  }

  private createPriceQueryString(priceOptions) {
    let query = [];
    if (priceOptions instanceof Array) {
      for (let option of priceOptions) {
        query.push(this.priceFilterOptions[option].ht ? `filter[price_ht]=${this.priceFilterOptions[option].ht}` : '');
        query.push(this.priceFilterOptions[option].lt ? `filter[price_lt]=${this.priceFilterOptions[option].lt}` : '');
      }
    }
    else {
      query.push(this.priceFilterOptions[priceOptions].ht ? `filter[price_ht]=${this.priceFilterOptions[priceOptions].ht}` : '');
      query.push(this.priceFilterOptions[priceOptions].lt ? `filter[price_lt]=${this.priceFilterOptions[priceOptions].lt}` : '');
    }
    return query;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
