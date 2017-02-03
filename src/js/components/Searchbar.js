import Inferno from "inferno";
import Component from "inferno-component";

export default class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      engineIndex: 0,
      value: "",
    };

    this.engines = [
      "Search Google",
      "Go to subreddit",
      "Go to board",
      "Search DuckDuckGo",
    ];
    this.engineCMD = [
      "g",
      "r",
      "4",
      "d",
    ];

    this.isUrl = this.isUrl.bind(this);
    this.parseInput = this.parseInput.bind(this);
    this.googleSearch = this.googleSearch.bind(this);
    this.changeSearchEngine = this.changeSearchEngine.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onEnter(e) {
    if (e.keyCode === 13) {
      this.googleSearch(e.target.value);
    }
  }

  parseInput(e) {
    console.log("parsing input")
    console.log(e.srcElement.innerHTML);
    const value = e.target.value;
    if (e.keyCode === 13) {
      this.googleSearch(e.target.value);
    } else if (value.length === 2 && value[0] === "!") {
      this.changeSearchEngine(value[1]);
    } else {
      this.setState({ value });
    }
  }

  isUrl(str) {
    // Stolen from stackoverflow :(
    const pattern = new RegExp(
      /* eslint-disable */
    /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
    /* eslint-enable */
    );
    return (pattern.test("https://" + str) || pattern.test(str));
  }

  googleSearch(query) {
    console.log(query);
    if (this.isUrl(query)) {
      if (this.isUrl("https://" + query)) {
        window.location.href = "https://" + query;
        return;
      }
      window.location.href = query;
      return;
    }
    window.location.href = "https://www.google.com/search?q=" + query;
  }

  changeSearchEngine(engine) {
    const engineIndex = this.engineCMD.indexOf(engine);
    if (engineIndex > -1) {
      this.setState({ engineIndex });
    }
    this.setState({ value: "" });
  }

  onChange(e) {
    console.log(e);
  }

  render() {
    return (
      <input
        autoFocus
        tabIndex="1"
        className="searchbar"
        onInput={e => this.parseInput(e)}
        onKeyPress={e => this.onEnter(e)}
        placeholder={this.engines[this.state.engineIndex] + " or type URL"}
        type="text"
        id="input"
        value={this.state.value}

        style={{ backgroundImage: "url(images/google_icon.png)" }}
      />
    );
  }
}
