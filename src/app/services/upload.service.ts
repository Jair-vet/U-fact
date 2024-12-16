import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Certificate } from '../models/certificate.model';
import { map } from 'rxjs';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }


  async uploadImage(
    image: File,
    folder: string, type: string, before: string) {
    console.log(image)
    try {
      const url = 'https://www.binteapi.com:8080/api/submit/endpoint-dynamic/'
      const formData = new FormData()

      formData.append('file', image)
      formData.append('bucket_name', folder)
      formData.append('folder_name', type)
      formData.append('endpoint_path', 'https://nyc3.digitaloceanspaces.com/sgp-web/Inncaplast/')
      if (before == '') {
        formData.append('with_replace', 'false')
      } else {
        formData.append('with_replace', 'true')
        formData.append('before_name', before)
      }



      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': 'Token a7143f2e369e24e9ec084081de3f0927b4ea77a0',
        },
        body: formData
      })

      const data = await resp.json()
      console.log(data)
      if (resp.status == 201) {

        return data
      } else {
        console.log('false')
        return false
      }

    } catch (error) {
      console.log(error)
      return false
    }

  }


  getDataCertificate(
    certificate: File, key: File, password: string) {
    if (!certificate) {
      console.log('error')
    }

    const url = `${base_url}/pdf/certificate/data`
    const formData = new FormData()

    formData.append('certificate', certificate)
    formData.append('key', key)
    formData.append('password', password)
    console.log(formData.get('certificate'))
    return this.http.post<Certificate>(url, formData).pipe(map((resp: any) => resp.data));


  }
  async uploadPDF(
    pdfClient: File,
  ) {

    try {
      const url = `${base_url}/pdf/pdf_client/data`
      const formData = new FormData()

      formData.append('client', pdfClient)



      const resp = await fetch(url, {
        method: 'POST',
        body: formData
      })

      const data = await resp.json()

      if (resp.status == 200) {
        console.log(data)
        return data
      } else {
        return false
      }

    } catch (error) {
      console.log(error)
      return false
    }
  }
}
