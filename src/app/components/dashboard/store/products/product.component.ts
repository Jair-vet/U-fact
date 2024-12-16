import { BooleanInput } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { JoyrideService } from 'ngx-joyride';
import { Product } from 'src/app/models/product.model';
import { HelpService } from 'src/app/services/help.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { PdfViewComponent } from '../components/pdf-view/pdf-view.component';
import { MatDialog } from '@angular/material/dialog';
import { CatalogAvailableInventoryComponent } from '../components/catalog-available-inventory/catalog-available-inventory.component';
import { CatalogEntriesComponent } from '../components/catalog-entries/catalog-entries.component';
import { RoutingService } from 'src/app/services/routing.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})

export class ProductComponent implements OnInit {
  loading: boolean = false
  inactive: boolean = false
  displayedColumns: string[] = ['code', 'description', 'store_inventory', 'requested_inventory', 'entries', 'departures', 'actions'];
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = false
  colBig!: number;
  colMedium!: number;
  modalWidth!: string
  steps!: string[]
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private readonly joyrideService: JoyrideService, private dialog: MatDialog, private _helpService: HelpService, private _router: Router, private breakpointObserver: BreakpointObserver, private _productService: ProductService, private _userService: UserService, private _routingService: RoutingService) {
    this._helpService.helpClient()
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
          this.modalWidth = '85%'
        }
        if (result.breakpoints[Breakpoints.Large]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '75%'
        }
        if (result.breakpoints[Breakpoints.XLarge]) {
          this.colBig = 10
          this.colMedium = 2
          this.modalWidth = '65%'
        }
      }
    });
  }


  inactiveRecord(record: Product) {
    Swal.fire({
      title: 'DESACTIVAR',
      text: '¿ESTAS SEGURO DE DESACTIVAR EL REGISTRO ' + record.description.toString() + ' CON NUMERO [' + record.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this._productService.inactive(record.id!.toString()).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadData();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },

        })
      }
    })
  }

  openEntries(product: Product) {

    const dialogRef = this.dialog.open(CatalogEntriesComponent, {
      disableClose: false,
      width: this.modalWidth,
      height: 'auto',
      data: { data: { id_product: product.id } }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        console.log(result)
        if (result.id_status == 1) {
          this._routingService.setRouting(`dashboard/entries/detail-entry/${result.id}`, `dashboard/products`)
          this._router.navigateByUrl(`dashboard/entries/detail-entry/${result.id}`)
        } else if (result.id_status == 3) {
          this._routingService.setRouting(`dashboard/entries/generate-entry/${result.id}`, `dashboard/products`)
          this._router.navigateByUrl(`dashboard/entries/generate-entry/${result.id}`)
        } else {
          Swal.fire({ title: 'ERROR', text: 'LA ENTRADA HA SIDO RECHAZADA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
        }
      }
    });

  }
  seeBoxes(product: Product) {

    const dialogRef = this.dialog.open(CatalogAvailableInventoryComponent, {
      width: this.modalWidth,
      height: 'auto',
      data: product
    });

  }

  changeStateInactive(state: boolean) {
    this.inactive = state
    this.changeData()
  }

  printFile(dataReport: any) {

    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: dataReport, id_client: 0, type: '', pdf_elements: [], sendEmail: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {

      }
    });
  }



  reportProducts() {
    this.loading = true
    this._productService.getReportProducts(this.inactive).subscribe({
      next: (resp) => {
        console.log(resp)
        this.printFile(resp)

      },
      complete: () => {
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })

      },
    })
  }

  restore(record: Product) {
    Swal.fire({
      title: 'RESTAURAR',
      text: '¿ESTAS SEGURO DE RESTAURAR EL REGISTRO ' + record.description + ' CON NUMERO [' + record.number!.toString() + ']',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'RESTARURAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true,
      heightAuto: false
    }).then((result) => {
      if (result.isConfirmed) {
        this._productService.restore(record.id!.toString()).subscribe({
          next: (resp) => {
            Swal.fire({ title: 'REGISTRO RESTAURADO', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
          complete: () => {
            this.loadData();
          },
          error: (err) => {
            console.log(err)
            Swal.fire({ title: 'ERROR', text: 'HA OCURRIDO UN ERROR INTENTANDO RESTAURAR EL REGISTRO', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          },
        })
      }
    })
  }


  validateCSD() {
    if (this._userService.user.serial != '' && this._userService.user.postal_code != '') {
      this._router.navigateByUrl('dashboard/products/create-product')
    } else {
      Swal.fire({ title: 'ERROR', text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false }).then(() => {
        this._helpService.helpCert()
        this.showHelp()
      })
    }
  }


  showHelp() {
    this.steps = this._helpService.help()
    this.joyrideService.startTour({
      steps: this.steps,
      customTexts: {
        next: '>',
        prev: '<',
        done: 'Ok'
      }
    });
    this._helpService.helpInvoice()
  }


  async changeData() {
    this.isDisabled = true
    this.loading = true
    this.loadData();
  }


  loadData() {
    this.loading = true
    this._productService.getAllData(this._userService.user.getIdCompany.toString(), this.inactive).subscribe({
      next: (resp) => {
        this.dataSource = new MatTableDataSource(resp);
        this.loading = false
      },
      complete: () => {

        this.dataSource.sort = this.sort;
        this.isDisabled = false

      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },
    })
  }


  ngOnInit(): void {
    this.loadData();
  }


  ngAfterViewInit() {
  }

}
