import { Component, VERSION, OnInit,ViewChild,ElementRef} from '@angular/core';
import '@tensorflow/tfjs-backend-webgl';
import * as blazeface from '@tensorflow-models/blazeface';
import { angularMath } from 'angular-ts-math/dist/angular-ts-math/angular-ts-math';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

// declare var MediaRecorder: any;
export class AppComponent implements OnInit {
  
  constructor() {};

  // ngOnInit(): void {};
  // @ViewChild('recordedVideo') recordVideoElementRef: ElementRef;
  @ViewChild('video') videoElementRef: ElementRef;

  name = 'Angular ' + VERSION.major;
  video!: any;
  state = 0;
  can!: any;
  ctx!: any;
  videoElement!: HTMLVideoElement;
  recordVideoElement!: HTMLVideoElement;
  mediaRecorder: any;
  recordedBlobs!: any;
  isRecording: boolean = false;
  downloadUrl!: any;
  stream!: any;
  videoBuffer!: any;
  downloadBtn!: any;
  status!:any;
  overlay!:any;
 

  async ngOnInit() {
    // navigator.permissions
    //   .query({ name: 'camera' })
    //   .then(function (permissionStatus) {
    //     if (permissionStatus.state == 'denied') {
    //       alert('Please give camera permission');
    //       console.log(permissionStatus.state);
    //     } else if (permissionStatus.state == 'granted') {
    //       console.log('Granted');
    //     }
    //     permissionStatus.onchange = function () {
    //       if (permissionStatus.state == 'denied') {
    //         console.log(permissionStatus.state);
    //         alert('Please refresh and give camera permission');
    //       }
    //     };
    //   });
    navigator.mediaDevices
    .getUserMedia({
      video: {
        width: 360
      }
    })
    .then(stream => {
      this.videoElement = this.videoElementRef.nativeElement;
      // this.recordVideoElement = this.recordVideoElementRef.nativeElement;

      this.stream = stream;
      this.videoElement.srcObject = this.stream;
    });


    this.setupCamera();
    this.predictFace();
    this.setupCamera();
    this.predictFace();
    
    this.video = document.getElementById("video");
    this.overlay = document.getElementById('inner-overlay');
    // this.can = document.getElementById('canv');
    // this.ctx = this.can.getContext("2d");
    // this.ctx.rect(155,40,70,80 );
    //this.ctx.ellipse(100, 100, 50, 70, 0, 0, angularMath.getPi() * 2);
    // this.ctx.stroke();
    //this.can.drawImage(this.video ,150 ,150 , 50 , 50);
    
  }
  setupCamera() {

    navigator.mediaDevices
    
      .getUserMedia({
        audio: false,
        video: {
          
          facingMode: 'user',
        },
      })
      .then((stream) => {
        this.video.srcObject = stream;
        // this.predictFace();
      })
      .catch((err) => {
        if (err.name == 'NotAllowedError') {
          console.log('Permission denied');
          alert('Please give camera permission');
          // this.setupCamera();
        }
      });
  }
  async predictFace() {
    
    const model = await blazeface.load();
    console.log('Model Loaded');
    setInterval(async () => {
      let predictions = model.estimateFaces(this.video);
      // if (predictions[0]['probability'][0] > 0.99) {

      //   console.log('face found');
      // }
      // else {
      //   console.log('face not found');
      // }

      let faceCoordinates = await(predictions);    
      if (faceCoordinates.length > 0) {
        for (let i = 0; i < faceCoordinates.length; i++) {
          console.log((faceCoordinates));
          
        }
        // let start = await(predictions);
        // console.log(typeof(faceCoordinates[0].topLeft))
        let faceCoord_topLeft = faceCoordinates[0].topLeft
        let faceCoord_bottomRight = faceCoordinates[0].bottomRight;
        // console.log(start,end)
      
      // if (predictions.length() > 0) {

        // for (let i = 0; i < predictions.length; i++) {
    
        
        // const size = [end[0] - start[0], end[1] - start[1]];
        // this.ctx.stroke();
        const canvas_coord_start = [110, 100];
        // console.log(start[0],start[1])
        const canvas_coord_end = [510, 400];
    
        // const size1 = [end1[0] - start1[0], end1[1] - start1[1]];
        // console.log(start[0], start1[0])
        // console.log(end[1], end1[1])
        let status = document.getElementById('status')
        if (faceCoord_topLeft[0] >= canvas_coord_start[0] && faceCoord_topLeft[1]>= canvas_coord_start[1] && faceCoord_bottomRight[0] <= canvas_coord_end[0] && faceCoord_bottomRight[1] <= canvas_coord_end[1]) {
          // text('STATUS: FACE FOUND');

          console.log('INSIDE')
          this.overlay.style.border = "6px solid green"
          // this.ctx.beginPath();
          // this.ctx.lineWidth = "7";
          // this.ctx.strokeStyle = "white";
          // this.ctx.strokeStyle = "green";
          // this.ctx.ellipse(320, 250, 150, 205, 0, 0, Math.PI*2);
          // this.ctx.rect(start1[0], start1[1], size1[0], size1[1]);
          // this.ctx.arc(320,250,170,0,2*Math.PI);
          // this.ctx.stroke();
        }
        else {
          // text('STATUS: PLEASE PLACE YOUR FACE INSIDE THE BOX');
          // this.ctx.beginPath();
          // this.ctx.lineWidth = "7";
          // this.ctx.strokeStyle = "white";
          // this.ctx.strokeStyle = "red";
          // this.ctx.rect(start1[0], start1[1], size1[0], size1[1]);
          // this.ctx.ellipse(320, 250, 150, 205, 0, 0, Math.PI*2);
          // this.ctx.stroke();
          this.overlay.style.border = "6px solid red"
          console.log('OUTSIDE')
        }
    
    
      // }
    }

      
    }, 100);
  }
  

  onDataAvailableEvent() {
    try {
      this.mediaRecorder.ondataavailable = (event: any) => {
        if (event.data && event.data.size > 0) {
          this.recordedBlobs.push(event.data);
        }
      };
    } catch (error) {
      console.log(error);
    }
  }

  // download(){
  //   let url = this.downloadUrl 
  //   this.downloadBtn = document.getElementById("downloadButton");

  //   try{
  //     console.log("download working")
  //     const aTag = document.createElement("a");

  //       aTag.href = url;

  //       aTag.download = url.replace(/^.*[\\\/]/, '');

  //       document.body.appendChild(aTag);

  //       aTag.click();

  //       this.downloadBtn.innerText = "File Downloaded";
      
  //   }
  //   catch{
  //     console.log("Cant Download")
  //   }

  // }
  
  
  onStopRecordingEvent() {
    try {
      this.mediaRecorder.onstop = (event: Event) => {
        const videoBuffer = new Blob(this.recordedBlobs, {
          type: 'video/webm'
        });
        
          // this.downloadUrl = window.URL.createObjectURL(videoBuffer);
          // this.recordVideoElement.src = this.downloadUrl;
          // console.log(window.URL.createObjectURL(videoBuffer))
          
          
        
        // this.downloadUrl = window.URL.createObjectURL(videoBuffer);
        
        // you can download with <a> tag
        //this.recordVideoElement.src = this.downloadUrl;
         //console.log("button()")
        // console.log(window.URL.createObjectURL(videoBuffer))
      };
    } catch (error) {
      console.log(error);
    }
   
  }

 
}