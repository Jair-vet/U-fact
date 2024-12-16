import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatTableDataSource } from '@angular/material/table';
import { ProdServ } from 'src/app/models/sat.model';
import { SatService } from 'src/app/services/sat.service';


@Component({
  selector: 'app-catalog-sat',
  templateUrl: './catalog-sat.component.html',
  styleUrls: ['./catalog-sat.component.scss']
})
export class CatalogSatComponent {
  loading: Boolean = false
  displayedColumns: string[] = ['code', 'description', 'actions'];
  form: FormGroup
  dataSource!: MatTableDataSource<any>;



  constructor(private _satService: SatService, private _formBuider: FormBuilder) {
    this.form = this._formBuider.group({
      dataSearch: ['', Validators.required],
      controlPaginator: ['1', [Validators.required]],

    })
  }

  changeCodesForPagination(position: number) {
    console.log(position)
    let result = parseInt(this.form.value.controlPaginator) + position
    this.form.controls['controlPaginator'].setValue(result.toString())
    this.loadCodes()

  }


  loadCodes() {
    this.loading = true
    this._satService.getProdServ(this.form.value.controlPaginator).subscribe({
      next: (resp) => {

        this.dataSource = resp;

      },
      complete: () => {
        this.loading = false
        console.log('COMPLETE')
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }


  searchCodes() {
    this.loading = true
    this._satService.searchProdServ(this.form.value.dataSearch).subscribe({
      next: (resp) => {

        this.dataSource = resp;

      },
      complete: () => {
        this.loading = false
        console.log('COMPLETE')
      },
      error: (err) => {
        this.loading = false
        console.log(err)
      },

    })
  }
  ngAfterViewInit() {
  }


  ngOnInit(): void {
    this.loadCodes()
  }


}
