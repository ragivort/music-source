import { Component, OnInit } from '@angular/core';

import { AudioService } from '../../services/audio.service';
import { CloudService } from '../../services/cloud.service';
import { StreamState } from '../../interfaces/stream-state';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  files: any = [];
  state: StreamState;
  currentFile: any = {};


  constructor(
    public audioService: AudioService,
    public cloudService: CloudService,
    public authService: AuthService
  ) {
    // get media files
    cloudService.getFiles().subscribe(files => {
      this.files = files;
      this.files = this.files.filter(s => s.artistId === 637838011);
      this.files.sort((a, b) => a.collectionName.localeCompare(b.collectionName));
    });
    // listen to stream state
    this.audioService.getState().subscribe(state => {
      this.state = state;
    });

  }

  playStream(previewUrl) {
    this.audioService.playStream(previewUrl).subscribe(events => {
      if (this.authService.logIn) {
        this.state.duration = 30;
        this.state.readableDuration = this.audioService.formatTime(this.state.duration);
      } else {
        this.state.duration = 15;
        this.state.readableDuration = this.audioService.formatTime(this.state.duration);
      }
      if (this.state.currentTime === 0 && this.state.playing === false && this.currentFile.index !== this.files.length - 1) {
        this.stop();
        setTimeout( () => this.playNext(this.currentFile), 1000);
      }
    });
  }

  openFile(file, index) {
    this.currentFile = { index, file };
    this.audioService.addToInventory(this.currentFile);
    this.audioService.stop();
    this.playStream(file.previewUrl);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  playNext(currentFile) {
    const index = currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  playPrevious(currentFile) {
    const index = currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }
  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }

  onSliderChangeVolume(changevolume) {
    this.audioService.changeVolume(changevolume.value);
  }

  ngOnInit() {
    this.audioService.invetoryChanged$.subscribe(file => {
      if (file !== undefined) {
        this.currentFile = file;
      }
    });
  }

}
