import { BrowserModule } from '@angular/platform-browser';
import { NgModule }      from '@angular/core';
import { HttpModule }    from '@angular/http';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent }        from './app.component';
import { ProductsComponent }   from './products/products.component';
import { ProductComponent }    from './product/product.component';
import { ProductsService }     from './products/products.service';
import { ProductService }      from './product/product.service';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [
    ProductsService,
    ProductService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
