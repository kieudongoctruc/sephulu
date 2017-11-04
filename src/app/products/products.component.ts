import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Product }         from '../product/product';
import { ProductsService } from './products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[];
  selectedProduct: Product;

  constructor(
    private productsService: ProductsService,
    private router: Router) { }

  getProducts(): void {
    this.productsService
        .getProducts()
        .then(products => {
          this.products = products
          console.log(this.products);
        });
  }

  ngOnInit(): void {
    this.getProducts();
  }

}
