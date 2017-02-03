/* eslint-disable inferno/prop-types */
import Inferno from "inferno";
import Component from "inferno-component";

const ColorThief = require("color-thief-standalone");

export default class TextCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      primary: [30, 30, 30],
      accent: [150, 150, 150],
    };
    this.percentageStart = 0;
    this.cycleStart = 0;
    this.palette = false;
    this.isPrimaryLighter = null;

    this.updateCanvas = this.updateCanvas.bind(this);
    this.generateFontStyle = this.generateFontStyle.bind(this);
    this.calcWidth = this.calcWidth.bind(this);
    this.calcHeight = this.calcHeight.bind(this);
    this.calculateLuminosity = this.calculateLuminosity.bind(this);
    this.shortGradient = this.shortGradient.bind(this);
  }
  componentWillMount() {
    this.interval = setInterval(() => {
      if (this.percentageStart >= (100 - (100 / this.props.fontStyle.segments))) {
        this.percentageStart = 0;
        this.cycleStart = 0;
      } else {
        this.percentageStart = this.percentageStart + (100 / this.props.fontStyle.segments);
        this.cycleStart = this.cycleStart + (100 / (this.props.fontStyle.segments - 1));
      }
      this.updateCanvas();
    }, this.props.interval);

    if (this.props.isVideo) {
      this.setState({
        img: true,
      });
    }
  }

  componentDidMount() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "http://fonts.googleapis.com/css?family="
      + this.props.fontStyle.font.replace(" ", "+")
      + ":400,400i,600,600i";
    document.getElementsByTagName("head")[0].appendChild(link);

    /**
     * Makes sure font is loaded before rendering
     * Credit goes to http://stackoverflow.com/a/5371426
     */
    const image = new Image();
    image.src = link.href;
    image.onerror = () => {
      this.updateCanvas();
      this.setState({ font: true });
    };

    /**
     * Makes sure font is loaded before rendering
     * Credit goes to http://stackoverflow.com/a/5371426
     */
    if (this.props.isVideo) {
      this.updateCanvas();
      return;
    }
    const colorThief = new ColorThief();
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const palette = colorThief.getPalette(img, 2);
      this.setState({
        img: true,
        primary: palette[0],
        accent: palette[1],
      });
      this.isPrimaryLighter =
        this.calculateLuminosity(...palette[0]) < this.calculateLuminosity(...palette[1]);
      this.updateCanvas(palette[0], palette[1]);
    };
    img.src = this.props.img;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getGradientValue(start, end, percent = 0, opacity = 1) {
    let startGradient = {};
    let endGradient   = {};
    if (Array.isArray(start)) {
      startGradient.r = start[0];
      startGradient.g = start[1];
      startGradient.b = start[2];
      endGradient.r   = end[0];
      endGradient.g   = end[1];
      endGradient.b   = end[2];
    } else {
      startGradient = start;
      endGradient = end;
    }
    return "rgba("
      + Math.round((startGradient.r * (percent / 100)) + (endGradient.r * (1 - (percent / 100)))) + ","
      + Math.round((startGradient.g * (percent / 100)) + (endGradient.g * (1 - (percent / 100)))) + ","
      + Math.round((startGradient.b * (percent / 100)) + (endGradient.b * (1 - (percent / 100)))) + ","
      + opacity + ")";
  }

  updateCanvas(primary, accent) {
    const canvas = document.getElementById("canvas");
    canvas.width = this.calcWidth(canvas);
    canvas.height = this.calcHeight(canvas);

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = this.generateFontStyle();
    ctx.lineWidth = this.props.fontStyle.stroke; // Text border

    /**
     * Miter tries to keep hard corners without "spikes" appearing on sharp corners
     * miterLimit is necessary so keep those spikes in check
     *
     * If stroke is too excessively thick proportional to text, it may still spike
     */
    ctx.lineJoin = "miter";
    ctx.miterLimit = (this.props.fontStyle.stroke > 3 ? 3 : this.props.fontStyle.stroke);

    const segments  = this.props.fontStyle.segments; // How many segments the gradient is divided in
    const thickness = this.props.fontStyle.thickness; // How thick those segments are

    let i = segments * thickness; // How many pixels in length extrusion will be down and right
    const iStartValue = i;

    let start;
    let end;
    if (primary && accent) {
      // FIRST DRAW
      if (this.calculateLuminosity(primary) > 40) {
        start = { r: primary[0], g: primary[1], b: primary[2] };
        end =   { r: accent[0],  g: accent[1],  b: accent[2] };
      } else {
        end   = { r: primary[0], g: primary[1], b: primary[2] };
        start = { r: accent[0],  g: accent[1],  b: accent[2] };
      }
      // SUBSEQUENT DRAWS
    } else if (this.calculateLuminosity(...this.state.primary) > 40) {
      start = { r: this.state.primary[0], g: this.state.primary[1], b: this.state.primary[2] };
      end =   { r: this.state.accent[0],  g: this.state.accent[1],  b: this.state.accent[2] };
    } else {
      end   = { r: this.state.primary[0], g: this.state.primary[1], b: this.state.primary[2] };
      start = { r: this.state.accent[0],  g: this.state.accent[1],  b: this.state.accent[2] };
    }

    /**
     * percentArray holds percentage values which represent
     * stops in our loop where we change color.
     *
     * When those stops occur, we use the percentage value to
     * get the corresponding color for the next segment
     */
    const percentArray = [];
    let cyclePercentage = this.cycleStart;
    for (let v = 0; v < segments; v += 1, cyclePercentage += Math.floor(100 / (segments - 1))) {
      /**
       * We use 100 / (segments - 1) to get the
       * whole 0 to 100 range on the gradient
       *
       * We also floor it because fractional percentages can push it over 100 each cycle
       */
      if (cyclePercentage > 100) {
        cyclePercentage = 0;
      }
      percentArray.push(Math.round(cyclePercentage));
    }

    const padding = (this.props.fontStyle.stroke / 2) + (this.props.padding);
    const text = this.props.text;
    const height = this.props.fontStyle.size
      - Math.round(this.props.fontStyle.size * 0.2); // Line height removal

    // Drawing the text extrusion
    for (; i > 0; i -= 1) {
      if ((i - iStartValue) % thickness === 0) {
        ctx.strokeStyle = this.getGradientValue(start, end, percentArray[(i / thickness) - 1]);
      }
      ctx.strokeText(text, i + 0 + padding, i + height + padding);
    }

    // The text itself
    if (this.props.fontStyle.stroke) {
      ctx.strokeStyle = this.getGradientValue(start, end, 30);
      ctx.strokeText(text, 0 + padding, height + padding);
    }

    ctx.fillStyle = "white";
    ctx.fillText(text, 0 + padding, height + padding);
  }

  calculateLuminosity(r, g, b) {
    // Credits http://stackoverflow.com/a/596241
    return ((r * 2) + g + (b * 3)) / 6;
  }

  generateFontStyle() {
    return [
      this.props.fontStyle.style.join(" "),
      this.props.fontStyle.size + "px",
      this.props.fontStyle.font,
    ].join(" ");
  }

  calcWidth(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.font = this.generateFontStyle();
    const extrusion =
      (this.props.fontStyle.segments
      * this.props.fontStyle.thickness)
      + this.props.fontStyle.stroke;
    const padding = this.props.padding * 2; // Padding both sides
    return Math.ceil(ctx.measureText(this.props.text).width + extrusion + padding);
  }
  calcHeight(canvas) {
    const ctx = canvas.getContext("2d");
    ctx.font = this.props.fontStyle.size + "px";
    const height = Math.ceil(parseInt(this.props.fontStyle.size, 10) * 0.85);
    const extrusion =
      (this.props.fontStyle.segments
      * this.props.fontStyle.thickness)
      + this.props.fontStyle.stroke;
    const padding = this.props.padding * 2; // Padding both sides
    return extrusion + height + padding;
  }
  shortGradient(percent) {
    return this.getGradientValue(
      [...this.state.primary],
      [...this.state.accent],
      percent);
  }

  render() {
    return (
      <div className="image-canvas">
        <canvas
          id="canvas"
          className="text-canvas"
          style={{
            display: (
              (this.state.font && this.state.img)
              ? "block"
              : "none"
              ),
          }}
        />
        <style>
          {
            this.state.img
            ?
// Weird indentation because template strings
`
html {
  background: ${this.shortGradient(90)};
  -webkit-animation: html 1s;
}
@-webkit-keyframes html {
  from { background: rgb(255,255,255); }
  to   { background: ${this.shortGradient(90)}; }
}

.searchbar {
  background-color: ${this.shortGradient(100)};
  opacity: 1;
  -webkit-animation: searchbar 1s;
}
@-webkit-keyframes searchbar {
  from { background-color: rgba(20,20,20,0);           opacity: 0; }
  to   { background-color: ${this.shortGradient(100)}; opacity: 1; }
}

.searchbar {
  color: ${this.shortGradient(10)};
}

[contenteditable=true]:empty:before {
  color: ${this.shortGradient(65)};
}
`
            :
              ""
          }
        </style>
      </div>
    );
  }
}
