import { BooleanInput } from '@angular/cdk/coercion';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PdfViewComponent } from 'src/app/components/dashboard/store/components/pdf-view/pdf-view.component';

import { Entry } from 'src/app/models/entry.model';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-certificates-traceability',
  templateUrl: './certificates-traceability.component.html',
  styleUrls: ['./certificates-traceability.component.scss']
})
export class CertificatesTraceabilityComponent implements OnInit {
  @Input() certificates: Entry[] = [];
  loading: boolean = false
  displayedColumns: string[] = ['number', 'date', 'actions']
  dataSource!: MatTableDataSource<any>;
  isDisabled: BooleanInput = true
  dataPDF: string = ''
  constructor(private _inventoryService: InventoryService, private dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.certificates);
    this.isDisabled = false
  }

  select(certificate: Entry, select: boolean) {
    certificate.selected = select
  }


  getCertDataPDF(certificate: Entry) {
    this.isDisabled = true
    this._inventoryService.getCert(certificate.id.toString()).subscribe({
      next: (resp) => {
        console.log(resp)
        this.dataPDF = resp
      },
      complete: () => {
        this.viewPDF()
        this.isDisabled = false
      },
      error: (err) => {
        this.isDisabled = false
      },
    })
  }

  viewPDF() {
    const dialogRef = this.dialog.open(PdfViewComponent, {
      width: '50%',
      height: 'auto',
      data: { data: this.dataPDF }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != '') {
      }
    });
  }
}
