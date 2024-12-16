import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { QuotationRequest } from 'src/app/models/quotation-request.model';
import { StatusQuotationRequest } from 'src/app/models/status-quotation-request.model';
// import { QuotationRequestService } from 'src/app/services/quotation-request.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { PdfViewComponent } from '../store/components/pdf-view/pdf-view.component';

@Component({
  selector: 'app-quotation-request',
  templateUrl: './quotation-request.component.html',
  styleUrls: ['./quotation-request.component.scss']
})
export class QuotationRequestComponent implements OnInit {
  loading: boolean = false
  error: boolean = false
  error_msg: string = 'ERROR EN SERVIDOR'
  displayedColumns: string[] = ['number', 'client', 'user', 'status', 'list_price', 'total_invest', 'actions']
  dataSource!: MatTableDataSource<any>
  status: StatusQuotationRequest[] = [new StatusQuotationRequest(1, 'POR AUTORIZAR'), new StatusQuotationRequest(2, 'AUTORIZADO'), new StatusQuotationRequest(3, 'CANCELADO')]
  isDisabled: boolean = false
  colBig!: number
  colMedium!: number
  modalWidth!: string
  steps!: string[]
  idStatus: number = 1
  dataPDF: string = ''
  numberPage: number = 1
  totalPages: number = 0
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _router: Router, private dialog: MatDialog, private breakpointObserver: BreakpointObserver, private _userService: UserService) {

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

          this.modalWidth = '100%'
        }
        if (result.breakpoints[Breakpoints.Small]) {
          this.colBig = 12
          this.colMedium = 12
          this.modalWidth = '100%'
        }

        if (result.breakpoints[Breakpoints.Medium]) {
          this.colBig = 9
          this.colMedium = 3
          this.modalWidth = '80%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '70%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '50%'
        }
      }
    });
  }



  cancel(record: QuotationRequest) {
    Swal.fire({
      title: 'CANCELAR COTIZACIÓN',
      text: '¿ESTAS SEGURO DE CANCEAR LA COTIZACIÓN ' + record.folio.toString() + ' CON NUMERO [' + record.number!.toString() + '] ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
      }
    })
  }





  validateCSD() {
    if (this._userService.user.serial != '' && this._userService.user.postal_code != '') {
      this._router.navigateByUrl('dashboard/quotation-request/create-quotation')
    } else {
      Swal.fire({ title: 'ERROR', text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false }).then(() => {
      })
    }
  }



  getDataQuotationRequest(quotationRequest: QuotationRequest) {
    this.loading = true
  }

  printFile(quotationRequest: QuotationRequest) {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPDF, id_client: quotationRequest.id_client, pdf_elements: quotationRequest, sendEmail: true, type: 'quotation-request' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }

  async changeData() {
    this.isDisabled = true
    this.loading = true
    this.loadData();
  }



  loadData() {
    this.loading = true
  }


  ngOnInit(): void {
    this.loadData();
  }

  changePage(newPage: number) {

    if (newPage != this.numberPage) {
      this.numberPage = newPage
      this.loadData()
    }
  }

  ngAfterViewInit() {
  }
}
