import Inferno from "inferno";
import Component from "inferno-component";

export default class Searchbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      engine: "g",
      value: "",
    };

    this.enginePrompts = {
      g:    "Search Google",
      r:    "Go to subreddit",
      "4":  "Go to board",
      d:    "Search DuckDuckGo",
    };
    this.engineURL = {
      g: {
        search: "https://www.google.com/search?q=",
        images: "https://www.google.com/search?tbm=isch&q=",
        news:   "https://www.google.com/search?tbm=nws&q=",
        maps:   "https://www.google.com/maps/search/"
      },
      r: {
        subreddit: "https://www.reddit.com/r/",
        search: "https://www.reddit.com/search?q=",
      },
      "4":  "Go to board",
      d:    "Search DuckDuckGo",
    };
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
      this.filterEngine(e.target.value);
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

  filterEngine(query) {
    const engine = this.state.engine;
    switch (engine) {
      case "g": {
        this.googleSearch(query);
        return;
      }
      case "r": {
        this.searchReddit(query);
        return;
      }
      case "4": {
        this.search4chan(query);
        return;
      }
      case "d": {
        this.searchDuckDuckGo(query);
        return;
      }
    }
  }

  googleSearch(query) {
    // Last 2 is search options, e.g. -i -m -n
    const last2 = query.slice(-2);
    const removeLast2 = (query) => {
      return (query.slice(0, query.length - 2)).trim();
    }
    console.log(last2)
    switch (last2) {
      case "-i": {
        // Image search
        window.location = this.engineURL.g.images + removeLast2(query);
        return;
      }
      case "-n": {
        // News search
        window.location = this.engineURL.g.news + removeLast2(query);
        return;
      }
      case "-m": {
        // Maps search
        window.location = this.engineURL.g.maps + removeLast2(query);
        return;
      }
      default: {
        window.location = this.engineURL.g.search + removeLast2(query);
      }
    }


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

  searchReddit(query) {
    /**
     * In the future I'd like to have cli commands such as -sr or -r
     * for specific types of searches.
     */
    if (query.indexOf(" ") === -1) {
      // No spaces, go to subreddit
      window.location = this.engineURL.r.subreddit + query;
    } else {
      // Well, guess we're searching
      window.location = this.engineURL.r.search + query;
    }
  }

  searchDuckDuckGo(query) {
    /**
     * Unfinished
     */
    if (query.indexOf(" ") === -1) {
      // No spaces, go to subreddit
      window.location = this.engineURL.r.subreddit + query;
    } else {
      // Well, guess we're searching
      window.location = this.engineURL.r.search + query;
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


  changeSearchEngine(engine) {
    const engineExists = this.engineCMD.indexOf(engine) !== -1;
    if (engineExists) {
      this.setState({
        engine,
        value: "",
      });
    }
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
        placeholder={this.enginePrompts[this.state.engine] + " or type URL"}
        type="text"
        id="input"
        value={this.state.value}

        style={{ backgroundImage: "url(images/google_icon.png)" }}
      />
    );
  }
}
