import Inferno from "inferno";
import Component from "inferno-component";
import axios from "axios";
import leftPad from "left-pad";
import Searchbar from "./js/components/Searchbar";
import TextCanvas from "./js/components/TextCanvas";

require("./stylesheets/main.scss");

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      src: "",
      isVideo: false,
      maxImgHeight: 28,
    };
    setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
    this.isVideo = this.isVideo.bind(this);
    this.hasLoaded = this.hasLoaded.bind(this);
  }
  componentWillMount() {
    const img = new Image();
    img.onload = () => {
      this.setState({
        maxImgHeight: Math.ceil(img.height * (390 / img.width)), // 390 is width of container
      });
    };

    axios.get("http://localhost:3000/fetchNewestArchillectMedia")
    .then((response) => {
      img.src = response.data.url;
      this.setState({
        src: response.data.url,
        isVideo: this.isVideo(response.data.type),
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }
  isVideo(type) {
    return (type === "animated_gif");
  }
  hasLoaded() {
    return true;

    // Do some cool stuff with this in the future
    const img = document.getElementById("img");
    if (!img) {
      return false;
    }
    return img.complete;
  }
  render() {
    const pad0 = n => leftPad(n, 2, 0);
    const time =  pad0(this.state.time.getHours())
          + ":" + pad0(this.state.time.getMinutes())
          + ":" + pad0(this.state.time.getSeconds());
    const canvas = (
      <TextCanvas
        text={"Get to work friend"}
        padding={10}
        interval={150}
        fontStyle={{
          size: 34,
          font: "Droid Serif",
          style: ["bold", "italic"],
          stroke: 6,
          segments: 5,
          thickness: 10,
        }}
        img={this.state.src}
        isVideo={this.state.isVideo}
      />
    );
    return (
      <div style={{ margin: "100px", overflow: "hidden", paddingBottom: "20px" }}>
        <style>
          {
            (this.state.maxImgHeight > 28) ?
`

#image {
  opacity: 1;
  -webkit-animation: img-opacity 1s;
}
@-webkit-keyframes img-opacity {
  from  { opacity: 0; }
  to    { opacity: 1; }
}
`
: "yah"
          }
        </style>
        <div className="row">
          <div className="canvas-container">
            {
              this.state.src
                ? canvas
                : null
            }
          </div>
          <div className="col right" />
        </div>
        <div className="row">
          <div class="container">
            {
              !this.state.isVideo
              ? (
                <div className="image-container">
                  {
                    this.state.src
                    ? <img src={this.state.src} id="image" className="image" alt="" />
                    : null
                  }
                </div>
              )
              : (
                <div className="video-container">
                  {
                    this.state.src
                    ? <video src={this.state.src} autoPlay loop className="video" alt="" />
                    : null
                  }
                </div>
              )
            }
            <Searchbar />
          </div>
        </div>
      </div>
    );
  }
}
