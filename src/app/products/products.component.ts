import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
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

  filterBySortChanged(e) { this.setQueryParams({ 'sort': this.sort_by }) }

  filterByViewChanged(e) { this.setQueryParams({ 'view': this.view_by }) }

  setQueryParams(queryParams) {
    let navigationExtras: NavigationExtras = {
      queryParams: queryParams,
      queryParamsHandling: 'merge'
    };
    this.router.navigate(['/products'], navigationExtras);
  }

  queryParamsChanged(params) {
    this.filter = params;
    this.sort_by = params.sort ? params.sort : this.DEFAULT_SORT_BY;
    this.view_by = params.view ? params.view : this.DEFAULT_VIEW_BY;
    this.getProducts(params);
  }

  clearAllFilters() {
    this.router.navigate(['/products'], { queryParams: {} });
  }
}
