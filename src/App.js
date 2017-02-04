import Inferno from "inferno";
import Component from "inferno-component";
import axios from "axios";
import leftPad from "left-pad";
import Searchbar from "./js/components/Searchbar";
import TextCanvas from "./js/components/TextCanvas";
import { focusOnInput } from "./js/helpers/selection";

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
  }
  componentWillMount() {
    axios.get("http://localhost:3000/fetchNewestArchillectMedia")
    .then((response) => {
      this.setState({
        src: response.data.url,
        isVideo: this.isVideo(response.data.type),
      });
    })
    .catch((err) => {
      console.error(err);
    });
  }

  componentDidMount() {
    document.addEventListener("click", (e) => {
      e.preventDefault();
      const activeEl = document.activeElement;
      const input = document.getElementById("input");
      console.log("AAAAA")
      console.log({activeEl})
      console.log({input})
      console.log(e.target);
    });
  }

  isVideo(type) {
    return (type === "animated_gif");
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
          <div className="container">
            <div className="image-container">
              {
                this.state.src
                ? (
                  !this.state.isVideo
                ? (
                  <img
                    src={this.state.src}
                    id="image"
                    className="image"
                    alt=""
                  />
                ) : (
                  <video
                    src={this.state.src}
                    autoPlay
                    loop
                    className="image"
                    alt=""
                  />
                )) : null
              }
            </div>
            <Searchbar />
          </div>
        </div>
      </div>
    );
  }
}
