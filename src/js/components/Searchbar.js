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
  }

  onEnter(e) {
    if (e.keyCode === 13) {
      this.googleSearch(e.target.value);
    }
  }

  parseInput(e) {
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
    const pattern = new RegExp("^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$", "i"); // fragment locator
    return pattern.test(str);
  }

  googleSearch(query) {
    console.log(query);
    if (this.isUrl(query)) {
      /**
       * Naive way of checking if it has http/https in front
       * but it works for now
       */
      if (this.isUrl("https://www." + query)) {
        window.location.href = "https://www." + query;
      } else {
        window.location.href = query;
      }
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

  render() {
    return (
      <div className="col right">
        <div id="searchbar">
          <div className="searchbar-icon" style={{ backgroundImage: "url(images/google_icon.png)" }} />
          <input
            autoFocus
            className="searchbar"
            onInput={e => this.parseInput(e)}
            onKeyPress={e => this.onEnter(e)}
            placeholder={this.engines[this.state.engineIndex] + " or type URL"}
            type="text"
            id="input"
            value={this.state.value}
          />
        </div>
      </div>
    );
  }
}
