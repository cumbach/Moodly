var React = require('react');

var emotions = ["happiness", "sadness", "neutral"];

var Emotion = React.createClass({
  getInitialState: function () {
    return{
      emotionCheck: this.randomEmotion(),
      verified: false
    };
  },

  componentDidMount: function () {
    this.checkEmotion();
  },

  randomEmotion: function () {
    return emotions[Math.floor(Math.random() * emotions.length)];
  },

  selectEmotion: function () {
    var selected = false;
    var selectedEmotion;
<<<<<<< HEAD
    while (selected === false) {
      selectedEmotion = emotions[Math.floor(Math.random() * emotions)];
      if (selectedEmotion !== this.state.emotionCheck) {
=======
    while (!selected) {
      selectedEmotion = this.randomEmotion();
      if (selectedEmotion !== that.state.emotionCheck) {
>>>>>>> 82ade9d3763d418c373aa76735c5ea6465dbc5f7
        selected = true;
      }
    }
    return selectedEmotion;
  },

  checkEmotion: function () {
    var that = this;

    var interval = setInterval(function () {
      if (that.props.emotionScore < 0.9) {
        that.props.emotionCallback(that.state.emotionCheck);
      } else {
        clearInterval(interval);
        console.log("You DID IT!!");
      }
    }, 2000);
  },

  emotionFace: function () {
    if (this.state.emotionCheck == "happiness") {
      return ":)";
    } else {
      return ">:(";
    }
  },

  render: function () {
    var face = this.emotionFace();
    console.log(this.props.emotionScore);
    return (
      <div>
        <section className="emotion-text">
          Hello {this.props.username}! <br/>
          Make a {this.state.emotionCheck} face {face}<br/>
          {this.props.emotionScore}
        </section>
        <section>

        </section>
      </div>
    );
  }
});

module.exports = Emotion;
