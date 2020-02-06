import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {AudioService} from '../../services/audio.service';
import {CloudService} from '../../services/cloud.service';
import {PlayerComponent} from '../player/player.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  files: any = [];
  currentFile: any = {};

  constructor(
    public authService: AuthService,
    public audioService: AudioService,
    public playerComponent: PlayerComponent,
    public cloudService: CloudService
  ) {

  }

  login() {
    this.authService.login(this.username, this.password);
  }
  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }
  ngOnInit() {
    this.cloudService.getFiles().subscribe(files => {
      this.files = files;
      this.files.sort((a, b) => a.collectionName.localeCompare(b.collectionName));
    });
    this.audioService.invetoryChanged$.subscribe(file => {
      if (file !== undefined) {
        this.currentFile = file;
      }
    });
  }

}
