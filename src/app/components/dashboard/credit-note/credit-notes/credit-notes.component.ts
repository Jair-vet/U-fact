import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { PdfViewComponent } from '../../store/components/pdf-view/pdf-view.component';
import { CreditNoteService } from 'src/app/services/credit-note.service';
import { CreditNote } from 'src/app/models/credit-note.model';
import { User } from 'src/app/models/user.model';
import { Observable } from 'rxjs';
import {
  setPageCreditNote,
  setSearchCreditNote,
} from 'src/app/state/actions/filter-credit-note.actions';
import { Store } from '@ngrx/store';
import {
  selectPageCreditNote,
  selectSearchCreditNote,
} from 'src/app/state/selectors/filter-credit-note.selector';

@Component({
  selector: 'app-credit-notes',
  templateUrl: './credit-notes.component.html',
  styleUrls: ['./credit-notes.component.scss'],
})
export class CreditNotesComponent implements OnInit {
  loading: boolean = false;
  error: boolean = false;
  error_msg: string = '';
  inactive: boolean = false;
  displayedColumns: string[] = [
    'folio',
    'invoice',
    'sale_note',
    'type',
    'total',
    'status',
    'actions',
  ];
  dataSource!: MatTableDataSource<any>;
  isDisabled: boolean = false;
  colBig!: number;
  colMedium!: number;
  modalWidth!: string;
  dataPDF: string = '';
  numberPage: number = 1;
  totalPages: number = 0;
  user!: User;

  search: Observable<string> = new Observable();
  statusState: Observable<string> = new Observable();
  pageState: Observable<number> = new Observable();
  valueSearch: string = '';
  applyFilter() {
    this.dataSource.filter = this.valueSearch;
    this.store.dispatch(
      setSearchCreditNote({ search: this.dataSource.filter })
    );
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private store: Store<any>,
    private _router: Router,
    private dialog: MatDialog,
    private breakpointObserver: BreakpointObserver,
    private _creditNoteService: CreditNoteService,
    private _userService: UserService
  ) {
    this.user = this._userService.user;
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((result) => {
        if (result.matches) {
          if (result.breakpoints[Breakpoints.XSmall]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.colBig = 12;
            this.colMedium = 12;
            this.modalWidth = '100%';
          }

          if (result.breakpoints[Breakpoints.Medium]) {
            this.colBig = 9;
            this.colMedium = 3;
            this.modalWidth = '80%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '60%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.colBig = 10;
            this.colMedium = 2;
            this.modalWidth = '40%';
          }
        }
      });

    this.search = this.store.select(selectSearchCreditNote);
    this.pageState = this.store.select(selectPageCreditNote);
  }

  cancel(credit_note: CreditNote) {
    console.log(credit_note);
    Swal.fire({
      title:
        'SELECCIONA LA RAZÓN DE CANCELACIÓN DE LA NOTA DE CREDITO [' +
        credit_note.serie +
        '-' +
        credit_note.number +
        ']',
      input: 'select',
      inputOptions: {
        '1': '[01] Comprobante emitido con errores con relación',
        '2': '[02] Comprobante emitido con errores sin relación',
        '3': '[03] No se llevó acabo la operación',
        '4': '[04] Operación nominativa relacionada en una factura global',
      },
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'CONFIRMAR',
      cancelButtonText: 'CANCELAR',
      confirmButtonColor: '#58B1F7',
      reverseButtons: true,
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.loading = true;
        this._creditNoteService
          .cancelCreditNote(credit_note.id, result.value)
          .subscribe({
            next: (resp) => {
              console.log(resp);

              Swal.fire({
                title: 'OK',
                text: resp.message,
                icon: 'success',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
            complete: () => {
              this.loadData();
            },
            error: (err) => {
              this.loading = false;
              console.log(err);
              Swal.fire({
                title: 'ERROR',
                text: err.error.message,
                icon: 'error',
                confirmButtonColor: '#58B1F7',
                heightAuto: false,
              });
            },
          });
      }
    });
  }

  validateCSD() {
    if (
      this._userService.user.serial != '' &&
      this._userService.user.postal_code != ''
    ) {
      this._router.navigateByUrl('dashboard/credit-notes/create-credit-note');
    } else {
      Swal.fire({
        title: 'ERROR',
        text: 'AÚN NO HAZ INSTALDO TU CSD O TERMINADO DE CONFIGURAR LOS DATOS DE TU CUENTA',
        icon: 'error',
        confirmButtonColor: '#58B1F7',
        heightAuto: false,
      }).then(() => {});
    }
  }
  applySearch() {
    this.dataSource.filter = this.valueSearch;
    this.loading = false;
  }

  changePage(newPage: number) {
    if (newPage != this.numberPage) {
      this.numberPage = newPage;
      this.store.dispatch(setPageCreditNote({ page: this.numberPage }));
      this.loadData();
    }
  }

  generateCreditNote(creditNote: CreditNote) {
    this._creditNoteService.generateCreditNote(creditNote.id).subscribe({
      next: (resp) => {
        console.log(resp);
        this.dataPDF = resp;
      },
      complete: () => {
        this.printFile(creditNote);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
      },
    });
  }

  getDataCreditNote(creditNote: CreditNote) {
    this.loading = true;
    if (creditNote.path_pdf != '') {
      window.open(
        `https://sgp-web.nyc3.digitaloceanspaces.com/Inncaplast/${this._userService.user.rfc}/Credit_Notes/${creditNote.path_pdf}`,
        '_blank'
      );
      this.loading = false;
    } else {
      this.generateCreditNote(creditNote);
    }
  }

  printFile(creditNote: CreditNote) {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: {
        data: this.dataPDF,
        id_client: creditNote.id_client,
        sendEmail: false,
        type: 'credit-note',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result != '') {
      }
    });
  }

  loadData() {
    this.loading = true;
    this._creditNoteService.getCreditNotes(this.numberPage, 0).subscribe({
      next: (resp) => {
        console.log(resp);
        this.totalPages = resp.total_pages;
        this.dataSource = new MatTableDataSource(resp.data);
      },
      complete: () => {
        this.dataSource.sort = this.sort;
        this.applySearch();
      },
      error: (err) => {
        this.loading = false;
        this.error = true;
        this.error_msg = err.error.message;
      },
    });
  }

  clearPage() {
    this.store.dispatch(setPageCreditNote({ page: 1 }));
  }

  ngOnInit(): void {
    this.pageState.subscribe((response: number) => {
      this.numberPage = response;
    });

    this.search.subscribe((response: string) => {
      this.valueSearch = response;
    });

    this.loadData();
  }
}
