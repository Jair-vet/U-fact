import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ClientEmailsComponent } from '../../../common/client-emails/client-emails.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'pdf-view',
  template: `
    <mat-card>
      <mat-card-header class="primary" style="padding:10px">
        <mat-icon style=" font-size:20px">picture_as_pdf</mat-icon>
        <span>
          {{ title }}
        </span>
        <div class="item-spacer"></div>
        <span class="icon-close-modal" (click)="closeDialog()">&#10008;</span>
      </mat-card-header>

      <mat-card-content class="card-content">
        <mat-grid-list cols="12" rowHeight="80px">
          <mat-grid-tile [colspan]="6" [rowspan]="1">
            <input class="custom-input-download" [(ngModel)]="nameFile" />
            <button
              mat-raised-button
              class="btnPrimary"
              style="margin:10px;background-color:var(--yellow); color:black;"
              (click)="downloadPDF()"
              [disabled]="nameFile == ''"
            >
              <mat-icon>download</mat-icon>DESCARGAR
            </button>
            <div class="item-spacer"></div>
          </mat-grid-tile>
          <mat-grid-tile [colspan]="6" [rowspan]="1">
            <div class="item-spacer"></div>
            <button
              mat-raised-button
              *ngIf="data.sendEmail"
              class="btnPrimary"
              style="margin:10px;"
              (click)="openEmail()"
            >
              <mat-icon>email</mat-icon>ENVIAR
            </button>
          </mat-grid-tile>
        </mat-grid-list>
        <ngx-extended-pdf-viewer
          [base64Src]="data.data.data"
          [height]="'auto'"
          [useBrowserLocale]="true"
          [showHandToolButton]="false"
        >
        </ngx-extended-pdf-viewer>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      ::ng-deep .mat-dialog-container {
        padding: 0px !important;
        border-radius: 10px !important;
      }
    `,
  ],
})
export class PdfViewComponent {
  pdf_elements!: any;
  nameFile: string = 'Documento';
  title: string = 'VISTA DE PDF';
  withSystemEmail: string = '100%';
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<PdfViewComponent>,
    private breakpointObserver: BreakpointObserver
  ) {
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
            this.withSystemEmail = '100%';
          }
          if (result.breakpoints[Breakpoints.Small]) {
            this.withSystemEmail = '100%';
          }
          if (result.breakpoints[Breakpoints.Medium]) {
            this.withSystemEmail = '85%';
          }
          if (result.breakpoints[Breakpoints.Large]) {
            this.withSystemEmail = '65%';
          }
          if (result.breakpoints[Breakpoints.XLarge]) {
            this.withSystemEmail = '50%';
          }
        }
      });
    console.log(this.data.data.data);
  }

  closeDialog() {
    this.dialogRef.close();
  }
  downloadPDF() {
    const base64Data = this.data.data.data; // Tu cadena Base64 aquí
    console.log(this.data.data.data);

    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = url;
    enlaceDescarga.download = this.nameFile;
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();

    document.body.removeChild(enlaceDescarga);
    URL.revokeObjectURL(url);
  }
  openEmail() {
    console.log(this.data);
    if (this.data.sendEmail) {
      if (this.data.type == 'departures') {
        this.title = 'NOTA DE VENTA';
        this.pdf_elements = {
          departures: this.data.pdf_elements,
        };
      }
      if (this.data.type == 'purchase-order') {
        this.title = 'ORDEN DE COMPRA';
        this.pdf_elements = {
          purchase: this.data.pdf_elements,
        };
      }
      if (this.data.type == 'quotation-request') {
        this.title = 'COTIZACIÓN';
        this.pdf_elements = {
          quotations_request: this.data.pdf_elements,
        };
      }
      const dialogRef = this.dialog.open(ClientEmailsComponent, {
        width: this.withSystemEmail,
        height: 'auto',
        data: {
          id_client: this.data.id_client.toString(),
          data: this.pdf_elements,
          type: this.data.type,
        },
      });
    }
  }
}
