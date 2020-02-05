import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule} from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  uri = 'https://shrouded-atoll-78264.herokuapp.com/api';
  token;
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(username: string, password: string) {
    this.http.post(this.uri + '/authenticate', {username, password})
      .subscribe((resp: any) => {
        this.router.navigate(['']);
        localStorage.setItem('auth_token', resp.token);
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  public get logIn(): boolean {
    return (localStorage.getItem('auth_token') !== null);
  }

}
