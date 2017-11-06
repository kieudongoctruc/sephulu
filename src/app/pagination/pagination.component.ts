import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router }                              from '@angular/router';
import { NavigationExtras }                    from '@angular/router';

import { Product } from '../product/product';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input('current') currentPageNumber : number;
  @Input('last') lastPageNumber : number;

  list_numbers : any;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.lastPageNumber) {
      this.list_numbers = Array.apply(null, { length: this.lastPageNumber }).map(Number.call, Number);
    }
  }

  /***
  @function viewProductsAt
  @desc: view products at any page number
  @params: a page number
  @return error as Promise
  ***/
  viewProductsAt(pageNumber) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'page': pageNumber},
      queryParamsHandling: 'merge'
    };
    this.router.navigate(['/products'], navigationExtras);
  }
}
