var React = require('react');
var Emotion = require('emotion.jsx');

var FrontPage = React.createClass({
  getInitialState: function () {
      return {
        logIn: "Sign In",
        userName: "",
        emotionTest: false,
        emotionScore: 0
      };
  },

  checkEmotion: function(emotion) {
    var blobData = this.getImage();
    var that = this;
    $.ajax({
      url: "https://api.projectoxford.ai/emotion/v1.0/recognize",
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("Content-Type","application/octet-stream");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","6f76ecd049fc42ffb6bf91d26e37a9aa");
      },
      type: "POST",
      processData: false,
      data: blobData,
      emotion: emotion,
      success: function (data) {
        // debugger;
        var emotion = this.emotion;
        that.setState({ emotionScore: data[0].scores[emotion] });
      }
    });
  },


  dataURItoBlob: function(dataURI) {
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
  },

  componentDidMount: function () {
    setTimeout(function () {
      that.setState({ emotionTest: true });
    }, 2000);

    navigator.getUserMedia = (navigator.getUserMedia ||
                              navigator.webkitGetUserMedia ||
                              navigator.mozGetUserMedia ||
                              navigator.msGetUserMedia);
    if (navigator.getUserMedia) {
      var videoPlaying = false;
      var that = this;
      this.vid = document.getElementById('camera-stream');
      navigator.getUserMedia(
        {
          video: true
        },
        function(localMediaStream) {
          that.vid.src = window.URL.createObjectURL(localMediaStream);
          videoPlaying  = true;
        },
        function(err) {
          console.log('The following error occurred when trying to use getUserMedia: ' + err);
        }
      );
      document.getElementById('take').addEventListener('click', function(){
        if (videoPlaying){
          var userName = "Wilson";
          // var data = that.createPerson(userName);
          var data = this.detectPerson();
          // DETECTION BELOW
          // $.ajax({
          //   url: 'https://api.projectoxford.ai/face/v0/detections?subscription-key=f79747ed06a7400f8e1053a00639d44a',
          //   type: 'POST',
          //   contentType: 'application/octet-stream',
          //   processData: false,
          //   data: blobData,
          //   success: function (data) {
          //     // debugger;
          //     var html = '';
          //
          //     $.each(data, function (commentIndex, object) {
          //       var facebox = document.createElement( "div" );
          //       $(facebox).css({
          //         'position': 'absolute',
          //         'top': object.faceRectangle.top,
          //         'left': object.faceRectangle.left,
          //         'width': object.faceRectangle.width,
          //         'height': object.faceRectangle.height,
          //         'border': '3px solid white'
          //       });
          //       // debugger;
          //       var imgHolder = document.getElementsByClassName('img-holder')[0]
          //       imgHolder.appendChild(facebox)
          //       // html += 'faceid:' + object['faceId']+"\r\n";
          //     });
          //     // alert(html);
          //   }
          // })
          document.getElementById('photo').setAttribute('src', data);
        }
      }.bind(this), false);
    } else {
      alert('Sorry, your browser does not support getUserMedia');
    }
  },

  detectPerson: function (callback, userName) {
    var that = this;
    // grab picture
    var blobData = that.getImage();

    $.ajax({
      url: 'https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false',
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("Content-Type","application/octet-stream");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f79747ed06a7400f8e1053a00639d44a");
      },
      type: 'POST',
      processData: false,
      data: blobData,
      success: function (data) {

        callback(data[0].faceId, blobData, userName || '');
        // console.log(data[0].faceId);
        // debugger;
        // var html = '';
        //
        // $.each(data, function (commentIndex, object) {
        //   var facebox = document.createElement( "div" );
        //   $(facebox).css({
        //     'position': 'absolute',
        //     'top': object.faceRectangle.top,
        //     'left': object.faceRectangle.left,
        //     'width': object.faceRectangle.width,
        //     'height': object.faceRectangle.height,
        //     'border': '3px solid white'
        //   });
          // debugger;
          // var imgHolder = document.getElementsByClassName('img-holder')[0];
          // imgHolder.appendChild(facebox);
          // html += 'faceid:' + object['faceId']+"\r\n";
        // });
        // alert(html);
      }
    });
  },

  createPerson: function (faceId, blobData, userName) {
    var data = JSON.stringify( {
      name: userName
    });

    var that = this;
    // create person
    $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/persongroups/piccklydevweek/persons",
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("Content-Type","application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f79747ed06a7400f8e1053a00639d44a");
      },
      type: "POST",
      data: data
    })
    .done(function(data) {
      console.log(data);
      that.addPersonFace(data.personId, blobData);
    })
    .fail(function() {
        alert("error");
    });
  },

  getImage: function () {
    var canvas = document.getElementById('canvas');
    canvas.width = this.vid.videoWidth;
    canvas.height = this.vid.videoHeight;
    canvas.getContext('2d').drawImage(this.vid, 0, 0);
    var data = canvas.toDataURL('image/jpg');
    var blobData = this.dataURItoBlob(data);
    return blobData;
  },

  addPersonFace: function (personId, blobData) {
    var that = this;
    $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/persongroups/piccklydevweek/persons/" + personId + "/persistedFaces",
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("Content-Type","application/octet-stream");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f79747ed06a7400f8e1053a00639d44a");
      },
      type: "POST",
      processData: false,
      data: blobData
    })
    .done(function(data) {
      console.log(data);
      that.trainPersonGroup();
    })
    .fail(function() {
        alert("error");
    });
  },

  trainPersonGroup: function () {
    $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/persongroups/piccklydevweek/train",
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f79747ed06a7400f8e1053a00639d44a");
      },
      type: "POST"
    })
    .done(function(data) {
      console.log("training");
    })
    .fail(function() {
        alert("error");
    });
  },

  identifyPerson: function (faceId, blobData) {
    var that = this;
    var dataObj = {
        "personGroupId":"piccklydevweek",
        "faceIds":[faceId],
        "maxNumOfCandidatesReturned":1
      };

    $.ajax({
      url: "https://api.projectoxford.ai/face/v1.0/identify",
      beforeSend: function(xhrObj){
          xhrObj.setRequestHeader("Content-Type","application/json");
          xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","f79747ed06a7400f8e1053a00639d44a");
      },
      type: "POST",
      data: JSON.stringify(dataObj)
    })
    .done(function(data) {
      var personId = data[0].candidates[0].personId;
      that.addPersonFace(personId, blobData);
      console.log(data);
    })
    .fail(function() {
        alert("error");
    });
  },

  changePageState: function () {
    if (this.state.logIn === "Sign In") {
      this.setState({ logIn: "Sign Up" });
    } else {
      this.setState({ logIn: "Sign In"});
    }
  },

  signUpUser: function () {
    var userName = this.state.userName;
    this.detectPerson(this.createPerson, userName);
  },

  signInUser: function () {
    this.detectPerson(this.identifyPerson);
  },

  inputChange: function (e) {
    this.setState({ userName: e.target.value });
  },

  render: function () {
    var switchLoginState = <div onClick={this.changePageState}>{this.state.logIn}</div>;
    var pageCommands;
    if (this.state.logIn === "Sign In") {
      pageCommands = <div>
                      <input className="userName"
                              onChange={this.inputChange}
                              value={this.state.userName}
                              placeholder="user name"></input>
                      <br/>
                      <button id="take" onClick={this.signUpUser}>Take a photo to Sign Up</button>
                    </div>;
    } else {
      pageCommands = <div>
                      <button id="take" onClick={this.signInUser}>Take a photo Sign In</button>
                    </div>;
    }
    var emotionTest;
    if (this.state.emotionTest) {
      emotionTest = (
        <Emotion username="Kyle"
          emotionCallback={this.checkEmotion}
          detectCallback={this.detectPerson}
          emotionScore={this.state.emotionScore}/>
      );
    } else {
      emotionTest = "";
    }

    return (
      <div>
        {switchLoginState}
        {pageCommands}
        <div id="video-container">
          <video id="camera-stream" width="500" autoPlay></video>
          <canvas id="canvas" style={{display: "none"}}></canvas>
        </div>
        {emotionTest}
        <div className="img-holder">
          <img src="" id="photo"/>
        </div>
      </div>
    );
  }
});
module.exports = FrontPage;
