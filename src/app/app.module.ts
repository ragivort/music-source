import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { PlayerComponent } from './pages/player/player.component';
import { MatFormFieldModule, MatInputModule, MatMenuModule } from '@angular/material';
import { LoginComponent } from './pages/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AudioService } from './services/audio.service';

@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: PlayerComponent},
      {path: 'login', component: LoginComponent},
      {path: '**', redirectTo: ''},
    ]),
    MatMenuModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [AudioService,PlayerComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
