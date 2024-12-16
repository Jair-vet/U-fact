import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, Subject, take, takeUntil } from 'rxjs';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { HelpService } from 'src/app/services/help.service';
import { ListPriceService } from 'src/app/services/list-price.service';
import { ListPrice } from 'src/app/models/list-price.model';
import { MatTableDataSource } from '@angular/material/table';
import { RoutingService } from 'src/app/services/routing.service';
import { FunctionsService } from 'src/app/services/helpers.service';

@Component({
  selector: 'app-edit-list-price',
  templateUrl: './edit-list-price.component.html',
  styleUrls: ['./edit-list-price.component.scss']
})
export class EditListPriceComponent implements OnInit {

  loading = true
  error = false
  error_msg: string = ''
  form: FormGroup
  listPrice!: ListPrice
  colBig!: number;
  colMedium!: number;
  colSmall!: number;
  idListPrice: string = ''
  path: string = 'dashboard/list-prices'
  displayedColumns: string[] = ['number', 'name', 'rfc', 'telephone', 'email', 'actions'];
  dataSource!: MatTableDataSource<any>;


  protected _onDestroy = new Subject<void>();


  constructor(private _routingService: RoutingService, private _helpService: HelpService, private _route: ActivatedRoute, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _router: Router, private _listPriceService: ListPriceService) {
    this._helpService.helpCreateProduct()
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
      Breakpoints.Medium,
      Breakpoints.Large,
      Breakpoints.XLarge,
    ]).subscribe(result => {
      if (result.matches) {
        if (result.breakpoints[Breakpoints.XSmall]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 12
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
        }
      }
    });

    this.form = this._formBuider.group({
      id: [''],
      label: ['', Validators.required],
      description: ['', Validators.required],
      porcentage: ['0', [Validators.pattern('[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)'), Validators.required]],
    })
    this.idListPrice = this._route.snapshot.paramMap.get('id') || '0'
    this._routingService.setRouting(`${this.path}/edit-list-price/${this.idListPrice}`, `${this.path}`)
  }

  cancel() {
    this._router.navigateByUrl(this.path)
  }


  loadData() {
    this._listPriceService.getData(this.idListPrice.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.listPrice = resp
        this.dataSource = new MatTableDataSource(resp.clients);
      },
      complete: () => {
        this.setFields()
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
      },
    })
  }


  setFields() {
    this.form.controls['id'].setValue(this.idListPrice)
    this.form.controls['description'].setValue(this.listPrice.description)
    this.form.controls['label'].setValue(this.listPrice.label)
    this.form.controls['porcentage'].setValue(this.listPrice.porcentage)
    this.loading = false

  }


  updateData() {
    this.loading = true
    this._listPriceService.update(this.form.value).subscribe({
      next: (resp) => {
        Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        this._router.navigateByUrl(this.path)
      },
      error: (err) => {
        this.loading = false
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
      },
      complete: () => {
        this.loading = false
      },
    })
  }


  ngOnInit(): void {
    this.loadData()
  }
}

