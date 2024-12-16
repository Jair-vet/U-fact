import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { ProductRawMaterial } from 'src/app/models/purchase-order.model';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { CatalogClientsComponent } from '../../orders/components/catalog-clients/catalog-clients.component';
import { CreditNoteService } from 'src/app/services/credit-note.service';
import { DepartureService } from 'src/app/services/departure.service';
import { Departure } from 'src/app/models/departure.model';
import { Inventory } from 'src/app/models/inventory.model';

const clearFields = environment.clearFields
@Component({
  selector: 'app-create-credit-note',
  templateUrl: './create-credit-note.component.html',
  styleUrls: ['./create-credit-note.component.scss']
})
export class CreateCreditNoteComponent implements OnInit {

  loading: Boolean = false
  form: FormGroup
  isDisabled: boolean = false
  displayedColumns: string[] = ['batch', 'number', 'product', 'date', 'actions'];
  @Output() dataChange: EventEmitter<any> = new EventEmitter<any>();
  dataSource!: MatTableDataSource<any>;
  colBig!: number;
  colXBig!: number
  colMedium!: number;
  colSmall!: number;
  boxes: Inventory[] = []
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }




  protected _onDestroy = new Subject<void>();
  path: string = 'dashboard/quotation-request'

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CreateCreditNoteComponent>, private _userService: UserService, private breakpointObserver: BreakpointObserver, private _formBuider: FormBuilder, private _creditNoteService: CreditNoteService, private _departureService: DepartureService) {

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
          this.colXBig = 12

        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.colSmall = 6
          this.colXBig = 12

        }
        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 12
          this.colMedium = 4
          this.colSmall = 4
          this.colXBig = 12

        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10

        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 6
          this.colMedium = 4
          this.colSmall = 2
          this.colXBig = 10

        }
      }
    });

    this.form = this._formBuider.group({
      comments: [''],
      total: ['0.00', Validators.required],
      id_type: ['1', Validators.required],
    })
  }

  setFields() {

  }

  loadData() {

    this.loading = true
    if (this.data.is_invoice) {
      this.loadBoxesByInvoice()
    } else {
      this.loadBoxesByDeparture()
    }


  }

  loadBoxesByInvoice() {
    this._departureService.getBoxesForInvoice(this.data.id_invoice.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataSource = new MatTableDataSource(resp.boxes);
      },
      complete: () => {
        this.loading = false
        this.isDisabled = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })

  }

  loadBoxesByDeparture() {
    this._departureService.getDeparture(this.data.id_departure.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataSource = new MatTableDataSource(resp.boxes);
      },
      complete: () => {
        this.loading = false

        this.isDisabled = false
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })

  }

  select(box: Inventory, selected: boolean) {
    if (selected) {
      this.boxes.push(box)
    } else {
      this.boxes = this.boxes.filter(object => object.id !== box.id);
    }
  }
  checkItem(box: Inventory) {
    console.log((this.boxes.find(object => object.id === box.id) == undefined) ? false : true)
    return ((this.boxes.find(object => object.id === box.id) == undefined) ? false : true)
  }

  closeDialog() {
    this.dialogRef.close();
  }

  create() {
    this.loading = true
    console.log(this.form.value.id_type_credit_note)
    if ((this.boxes.length > 0 && this.form.value.id_type == 2) || (this.form.value.id_type == 1)) {
      this._creditNoteService.create(this.form.value.comments, this.data.id_departure, this.boxes, this.form.value.id_type, this.data.is_invoice, this.data.id_client, this.data.id_invoice, parseFloat(this.form.value.total)).subscribe({
        next: (resp) => {
          console.log(resp)
          this.dataChange.emit(this.dataChange);
          Swal.fire({ title: 'OK', text: resp.message, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.loading = false
          this.closeDialog()
        },
        error: (err) => {
          console.log(err)
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          this.loading = false
        },
      })
    } else {
      this.loading = false
      Swal.fire({ title: 'ERROR', text: 'NO HAZ SELECCIONADO NINGUNA CAJA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false });

    }
  }

  ngOnInit(): void {
    this.loadData()

  }


}





