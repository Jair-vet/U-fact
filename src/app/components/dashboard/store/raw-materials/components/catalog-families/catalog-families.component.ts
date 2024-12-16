import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FamilyRawMaterialService } from 'src/app/services/family-raw-material.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-catalog-families',
  templateUrl: './catalog-families.component.html',
  styleUrls: ['./catalog-families.component.scss']
})
export class CatalogFamiliesComponent implements OnInit {

  loading: Boolean = false
  isDisabled: BooleanInput = false
  displayedColumns: string[] = ['family_product', 'actions'];
  dataSource!: MatTableDataSource<any>;


  applyFilter(event: Event) {
    console.log(event.target)
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private _familyRawMaterialService: FamilyRawMaterialService, private _userService: UserService) {

  }


  loadData() {
    this.loading = true
    this._familyRawMaterialService.getFamiliesRawMaterials(this._userService.user.id_company.toString()).subscribe({
      next: (resp) => {
        this.dataSource = resp;
        console.log(resp)
      },
      complete: () => {
        this.loading = false
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
