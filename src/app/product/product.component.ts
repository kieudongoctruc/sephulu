import 'rxjs/add/operator/switchMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Product }                from './product';
import { ProductService }         from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  product: Product;
  constructor(
    private productService: ProductService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.productService.getProduct(+params.get('id')))
      .subscribe(product => {
        this.product = product;
      });
  }

}
