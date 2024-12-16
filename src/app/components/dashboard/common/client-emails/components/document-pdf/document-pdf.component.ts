import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DocumentPDF } from 'src/app/models/document.model';

@Component({
  selector: 'app-document-pdf',
  templateUrl: './document-pdf.component.html',
  styleUrls: ['./document-pdf.component.scss']
})
export class DocumentPDFComponent implements OnInit {
  @Input() document!: DocumentPDF;
  @Input() id!: number
  @Output() eventId: EventEmitter<any> = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
  }

  getDocument(id: number) {
    console.log(id)
    this.eventId.emit(id);
  }

}
