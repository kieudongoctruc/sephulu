import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ActivatedRoute, ParamMap, Params, NavigationExtras } from '@angular/router';

import { Product }         from '../product/product';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  DEFAULT_SORT_BY = 'price' // Low to High
  DEFAULT_VIEW_BY = 25 // How many products are displayed per page

  products: Product[];
  sort_by = this.DEFAULT_SORT_BY;
  view_by = this.DEFAULT_VIEW_BY;
  priceFilter = [];
  price_filter_options = {
    0: { max: 25 },
    1: { min: 25, max: 50 },
    2: { min: 50, max: 100 },
    3: { min: 100, max: 150 },
    4: { min: 150, max: 300 },
    5: { min: 300 }
  }

  constructor(
    private productsService: ProductsService,
    private router: Router,
    private route: ActivatedRoute) { }

  getProducts(): void {
    this.productsService
        .getProducts()
        .then(products => {
          this.products = products;
        });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => this.queryParamsChanged(params));
    this.getProducts();
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

    // set the query params
    let navigationExtras: NavigationExtras = {
      queryParams: { 'price': this.priceFilter },
      queryParamsHandling: 'merge'
    };
    this.router.navigate(['/products'], navigationExtras);
  }

  queryParamsChanged(params) {
    console.log(params);
  }
}
