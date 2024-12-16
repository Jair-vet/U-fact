import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  style = document.documentElement.style;
  constructor() {

  }
  test() {

  }
  ngOnInit(): void {
    const color = localStorage.getItem('color') || '#061429'
    const colorSecondary = localStorage.getItem('colorSecondary') || '#526788'
    const colorAux = localStorage.getItem('colorAux') || '#84a1d1'
    this.style.setProperty('--primary', color);
    this.style.setProperty('--secondary', colorSecondary);
    this.style.setProperty('--aux', colorAux);

  }

}
