import { Component, OnInit }                        from '@angular/core';
import { Router }                                   from '@angular/router';
import { ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { Product }         from '../product/product';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  DEFAULT_SORT_BY = ''; // Low to High
  DEFAULT_VIEW_BY = 25; // How many products are displayed per page

  products: Product[];
  sort_by = this.DEFAULT_SORT_BY;
  view_by = this.DEFAULT_VIEW_BY;
  priceFilter = [];
  filter = {};
  currentPageNumber : number;
  lastPageNumber : number;

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute) { }

  /***
  @function getProducts
  @desc: call api to get list products
  @params: queryParams
  @return void
  ***/
  getProducts(queryParams): void {
    this.productsService
        .getProducts(queryParams)
        .then(
          products => {
            this.currentPageNumber = this.productsService.currentPageNumber;
            this.lastPageNumber = this.productsService.lastPageNumber;
            this.products = products;
          },
          error => {
            this.products = [];
          });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => this.queryParamsChanged(params));
  }

  /***
  @function queryParamsChanged
  @desc: watch if url is changed, then get list products again to update following the filter
  @params: params on url
  @return void
  ***/
  queryParamsChanged(params) {
    this.filter = params;
    this.sort_by = params.sort ? params.sort : this.DEFAULT_SORT_BY;
    this.view_by = params.view ? params.view : this.DEFAULT_VIEW_BY;
    this.getProducts(params);
  }

  /***
  @function filterByPriceChanged
  @desc: watch if the filter for price is changed, then update the route with new filter options
  @params: $event
  @return void
  ***/
  filterByPriceChanged(e) {
    // push the checked value to the price filter list
    // or get it out of the price filter list if unchecked it
    if(e.target.checked){
      this.priceFilter.push(e.target.value);
    }
    else {
      let index = this.priceFilter.indexOf(e.target.value);
      if (index > -1) {
        this.priceFilter.splice(index, 1);
      }
    }

    this.setQueryParams({ 'price': this.priceFilter });
  }

  /***
  @function filterBySortChanged
  @desc: watch if the filter for sort by is changed, then update the route with new filter options
  @params: $event
  @return void
  ***/
  filterBySortChanged(e) { this.setQueryParams({ 'sort': this.sort_by }) }

  /***
  @function filterByViewChanged
  @desc: watch if the filter for view by is changed, then update the route with new filter options
  @params: $event
  @return void
  ***/
  filterByViewChanged(e) { this.setQueryParams({ 'view': this.view_by }) }

  /***
  @function setQueryParams
  @desc: set filter to be  query params on url
  @params: queryParams
  @return void
  ***/
  setQueryParams(queryParams) {
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    };
    this.router.navigate(['/products'], navigationExtras);
  }

  /***
  @function clearAllFilters
  @desc: clear all filters user chose
  @params:
  @return void
  ***/
  clearAllFilters() {
    this.router.navigate(['/products'], { queryParams: {} });
  }
}
