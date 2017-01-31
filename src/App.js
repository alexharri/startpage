import Inferno from "inferno";
import Component from "inferno-component";
import axios from "axios";
import leftPad from "left-pad";
import Searchbar from "./js/components/Searchbar";
import ImageCanvas from "./js/components/ImageCanvas";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: new Date(),
      src: "",
    };
    setInterval(() => {
      this.setState({ time: new Date() });
    }, 1000);
    this.isVideo = this.isVideo.bind(this);
    this.hasLoaded = this.hasLoaded.bind(this);
  }
  componentWillMount() {
    axios.get("http://localhost:3000/mostRecentArchillectMedia")
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
    const hasLoaded = this.hasLoaded();
    const time =  pad0(this.state.time.getHours())
          + ":" + pad0(this.state.time.getMinutes())
          + ":" + pad0(this.state.time.getSeconds());
    const canvas = (
      <ImageCanvas
        text={"hey friend, how was your day?"}
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
        img={this.state.src ? (this.state.isVideo ? null : this.state.src) : null}
        id="canvas"
      />
    );
    return (
      <div style={{ margin: "100px" }}>
        <div className="row">
          <div className="col left">
            <div className="canvas-container">
              {
                this.state.src ? ( // eslint-disable-line no-nested-ternary
                  this.state.isVideo // eslint-disable-line no-nested-ternary
                  ? null
                  : (
                    hasLoaded
                    ? canvas
                    : null
                  )
                ) : null
              }
            </div>
          </div>
          <div className="col right">
          </div>
        </div>
        <div className="row">
          <div className="col left">
            <div className="date">
              {/*pad0(this.state.time.getDate())}
              /{pad0(this.state.time.getMonth() + 1)}
              /{this.state.time.getFullYear()*/}
            </div>
            {
              this.state.src ? ( // eslint-disable-line no-nested-ternary
                this.state.isVideo
                ? (
                  <div id="video">
                    <video src={this.state.src} autoPlay loop className="video" alt="" />
                  </div>
                )
                : (
                  <div id="image">
                    <img src={this.state.src} id="img" className="image" alt="" />
                  </div>
                )
              ) : null
            }
          </div>
          <Searchbar />
        </div>
      </div>
    );
  }
}
