import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudService {


  getFiles() {
    return this.http.get('https://ragivort.github.io/music/assets/lumen.json');
  }

  constructor(
    private http: HttpClient
  ) { }
}
