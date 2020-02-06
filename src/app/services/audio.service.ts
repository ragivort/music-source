import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';
import {StreamState} from '../interfaces/stream-state';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor(private authService: AuthService) {

  }
  stop$ = new Subject();
  private audioObj = new Audio();
  currentFile: any = {};
  audioEvents = [
    'ended', 'error', 'play', 'playing', 'pause', 'timeupdate', 'canplay', 'loadedmetadata', 'loadstart', 'volumechange'
  ];
  state: StreamState = {
    playing: false,
    readableCurrentTime: '',
    readableDuration: '',
    duration: undefined,
    currentTime: undefined,
    canplay: false,
    error: false,
    volume: undefined
  };
  private stateChange: BehaviorSubject<StreamState> = new BehaviorSubject(this.state);

  private inventorySubject$ = new BehaviorSubject<any>(this.currentFile);
  invetoryChanged$ = this.inventorySubject$.asObservable();

  private streamObservable(previewUrl) {


    return new Observable(observer => {
      // Play audio

      this.audioObj.src = previewUrl;
      this.audioObj.load();
      this.audioObj.play();


      const handler = (event: Event) => {
        this.updateStateEvents(event);
        observer.next(event);
        if (this.state.currentTime > this.state.duration) {
          this.audioObj.pause();
          this.audioObj.currentTime = 0;
        }
      };

      this.addEvents(this.audioObj, this.audioEvents, handler);

      return () => {
        // Stop Playing

        this.audioObj.pause();
        this.audioObj.currentTime = 0;
        this.audioObj.volume = 1;
        // remove event listeners
        this.removeEvents(this.audioObj, this.audioEvents, handler);
        // reset state
        this.resetState();
      };
    });
  }

  private addEvents(obj, events, handler) {
    events.forEach(event => {
      obj.addEventListener(event, handler);
    });
  }

  private removeEvents(obj, events, handler) {
    events.forEach(event => {
      obj.removeEventListener(event, handler);
    });
  }

  playStream(previewUrl) {
    return this.streamObservable(previewUrl).pipe(takeUntil(this.stop$));
  }

  play() {
    this.audioObj.play();
  }

  pause() {
    this.audioObj.pause();
  }

  stop() {
    this.stop$.next();
  }

  seekTo(seconds) {
    this.audioObj.currentTime = seconds;
  }

  changeVolume(volumevalue) {
    this.audioObj.volume = volumevalue;
  }

  formatTime(time: number, format: string = 'HH:mm:ss') {
    const momentTime = time * 1000;
    return moment.utc(momentTime).format(format);
  }

  updateStateEvents(event: Event): void {
    switch (event.type) {
      case 'canplay':
        !this.authService.logIn ? this.state.duration = 15 : this.state.duration = this.audioObj.duration;
        this.state.readableDuration = this.formatTime(this.state.duration);
        this.state.canplay = true;
        break;
      case 'playing':
        this.state.playing = true;
        break;
      case 'pause':
        this.state.playing = false;
        break;
      case 'timeupdate':
        this.state.currentTime = this.audioObj.currentTime;
        this.state.readableCurrentTime = this.formatTime(this.state.currentTime);
        break;
      case 'volumechange':
        this.state.volume = this.audioObj.volume;
        break;
      case 'error':
        this.resetState();
        this.state.error = true;
        break;
    }
    this.stateChange.next(this.state);
  }

  resetState() {
    this.state = {
      playing: false,
      readableCurrentTime: '',
      readableDuration: '',
      duration: undefined,
      currentTime: undefined,
      canplay: false,
      error: false,
      volume: undefined
    };
  }

  getState(): Observable<StreamState> {
    return this.stateChange.asObservable();
  }

  addToInventory(file) {
    this.currentFile = file;
    this.inventorySubject$.next(file);
  }
}
