import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatTableDataSource } from '@angular/material/table';
import { BooleanInput } from '@angular/cdk/coercion';
import { ComputerTableService } from 'src/app/services/computer-table.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EntryService } from 'src/app/services/entry.service';
import { SampleService } from 'src/app/services/sample.service';
import { ComputerTable } from 'src/app/models/computer-table.model';
import { Entry } from 'src/app/models/entry.model';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { RoutingService } from 'src/app/services/routing.service';
const clearFields = environment.clearFields;

@Component({
  selector: 'app-create-entry',
  templateUrl: './create-entry.component.html',
  styleUrls: ['./create-entry.component.scss']
})

export class CreateEntryComponent implements OnInit {
  loading = true
  error: boolean = false
  error_msg: string = ''
  displayedColumnsComputerTable: string[] = ['type', 'characteristics', 'units', 'value'];
  dataSourceComputerTable!: MatTableDataSource<ComputerTable>;
  isDisabled: BooleanInput = false
  colBig!: number;
  colMedium!: number;
  path: string = 'dashboard/entries'
  samples: ComputerTable[] = []
  entry!: Entry
  terminate!: boolean
  colXBig!: number
  colSmall!: number
  form: FormGroup
  id_entry!: string
  formArray: FormGroup[] = []
  public imageTemp: any = './assets/img/no-image.png';
  public image!: any;
  public imageName = ''
  pathImageDefault: string = './assets/img/pdf.png'
  isChangeImage = false
  activeIndex = 0
  message_wait = 'ESPERA POR FAVOR ESTE PROCESO TARDARA UNOS MINUTOS'

  constructor(private _routingService: RoutingService, private _sampleService: SampleService, private _entryService: EntryService, private _route: ActivatedRoute, private _computerTableService: ComputerTableService, private breakpointObserver: BreakpointObserver, private _router: Router, private _formBuider: FormBuilder) {
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
      code: [''],
      description: [''],
      comments: [''],
      invoice_attachment: [''],
      invoice_number: [''],

    })
    this.id_entry = this._route.snapshot.paramMap.get('id') || '0'
    this._routingService.setRouting(`dashboard/entries/generate-entry/${this.id_entry}`, `dashboard/entries`)
  }


  cancel() {
    this._router.navigateByUrl('dashboard/entries')
  }

  createSample() {
    this.loading = true
    if (this.entry.id_type_entry == 1) {

      this._sampleService.create(this.form.value.comments, this.dataSourceComputerTable.data, this.id_entry, this.entry.id_product.toString()).subscribe({
        next: (resp) => {
          Swal.fire({ title: 'OK', text: resp, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.loadData(false)
        },
        error: (err) => {
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          this.loading = false
        },
      })
    } 
  }


  changeImage(event: any): any {
    const file = event.target.files[0];
    this.image = file;

    if (!file) {
      this.imageTemp = this.pathImageDefault;
      this.isChangeImage = false
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    this.isChangeImage = true
    reader.onloadend = () => {
      this.imageTemp = reader.result;
      console.log(this.image.name)
      this.imageName = this.image.name
      this.form.controls['invoice_attachment'].setValue(this.imageName)

    }
  }

  setFields() {
    this.form.controls['code'].setValue(this.entry.code)
    this.form.controls['description'].setValue(this.entry.description)
    this.form.controls['comments'].setValue(this.entry.comments)
    this.form.controls['invoice_attachment'].setValue(this.entry.invoice_attachment)
    this.form.controls['invoice_number'].setValue(this.entry.invoice_number)
    this.image = undefined


  }

  loadComputerTable() {
    this.loading = true
    this._computerTableService.getAllData(this.entry.id_product.toString()).subscribe({
      next: (resp) => {
        this.dataSourceComputerTable = new MatTableDataSource(resp);
        this.loading = false
      },
      complete: () => {
        this.isDisabled = false
      },
      error: (err) => {
        this.error = false
        this.error_msg = err.error.message
        this.loading = false

      },
    })
  }

  validateStatus() {

    if (this.entry.id_status == 1) {
      this._router.navigateByUrl(`${this.path}/detail-entry/${this.entry.id}`)
    } else if (this.entry.id_status == 2) {
      Swal.fire({ title: 'ERROR', text: 'LA ENTRADA HA SIDO RECHAZADA', icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
    }

    this.loading = false
  }


  loadData(isFirstTime: boolean) {
    this.loading = true
    this._entryService.getData(this.id_entry).subscribe({
      next: (resp) => {
        this.entry = resp.data;
        console.log(this.entry)
        // this.terminate = resp.terminate

      },
      complete: () => {
        if (isFirstTime) {
          this.setFields()
          this.validateStatus()
          this.loadComputerTable()
        } else {
          if (clearFields) {
            this.loadComputerTable()
          }
          this.setFields()
          this.validateStatus()
        }
      },
      error: (err) => {
        this.error = true
        this.error_msg = err.error.message
        this.loading = false
        console.log(err)
      },
    })
  }

  delete() {
    this.loading = true
    if (this.entry.id_type_entry == 1) {
      this._entryService.delete(this.id_entry).subscribe({
        next: (resp) => {
          Swal.fire({ title: 'OK', text: resp.message, icon: 'success', confirmButtonColor: '#58B1F7', heightAuto: false })
        },
        complete: () => {
          this.loading = false
          this._router.navigateByUrl(`${this.path}`)

        },
        error: (err) => {
          Swal.fire({ title: 'ERROR', text: err.error.message, icon: 'error', confirmButtonColor: '#58B1F7', heightAuto: false })
          this.loading = false

        },
      })
    } 

  }

  ngOnInit(): void {
    this.loadData(true)
  }

}
