import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Product } from '../product/product';

@Injectable()
export class ProductsService {

  private productsUrl = 'https://sephora-api-frontend-test.herokuapp.com/products';  // URL to web api
  public currentPageNumber : number = 1;
  public lastPageNumber : number = 1;

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
  @params: query params object which is used to create query string
  @return list of products
  ***/
  getProducts(queryParams = {}): Promise<Product[]> {
    let queryString = this.createQueryString(queryParams);
    let url = this.productsUrl + '?' + queryString;
    return this.http.get(url)
               .toPromise()
               .then(response => {
                  // get how many pages the site has with current filter
                  if (response.json().links) {
                    this.currentPageNumber = this.getParamValueByName(response.json().links.self, 'page%5Bnumber%5D');
                    if (Object.keys(response.json().links).indexOf('last')) {
                      this.lastPageNumber =  this.getParamValueByName(response.json().links.last, 'page%5Bnumber%5D');
                    }
                    else {
                      this.getParamValueByName(response.json().links.self, 'page%5Bnumber%5D');
                    }
                  }
                  return response.json().data as Product[];
                })
               .catch(this.handleError);
  }

  /***
  @function createQueryString
  @desc: building query string after ? of url, ex: filter[category_in]=tools,brushes&sort=price&page[number]=2&page[size]=20
  @params: query params object which including all filter options user chose
  @return query string
  ***/
  private createQueryString(queryParams) {
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
        case 'page':
          params = value.length == 0 ? [''] : [`page[number]=${value}`];
          break;
      }
      query.push(params);
    }
    //flatten array of arrays
    query = [].concat.apply([], query);
    //remove empty elements
    query = query.filter(function(n) { return n != '' });
    //join all elements to be a completed string
    return query.join('&');
  }

  /***
  @function createPriceQueryString
  @desc: building query params string related to price cause it's more complex than the other ones.
  @params: price filter options user chose
  @return array of price query string, ex: ["filter[price_mt]=1000", "filter[price_lt]=2000"]
  ***/
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

  /***
  @function handleError
  @desc: if the request failed, this functions is called
  @params: error
  @return error as Promise
  ***/
  getParamValueByName(url, paramName) {
    if (typeof url == 'undefined') return '';
    var queryParams = {};
    var hashes = url.slice(url.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
      let hash = hashes[i].split('=');
      queryParams[hash[0]] = hash[1];
    }
    return queryParams[paramName];
  }
}
