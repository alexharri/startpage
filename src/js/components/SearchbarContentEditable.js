import Inferno from "inferno";
import Component from "inferno-component";

export default class SearchbarContentEditable extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    document.getElementById("input").addEventListener("keydown", (e) => {
      if (e.code === "Enter") {
        e.preventDefault();
        if (e.code === "Enter") {
          e.preventDefault();
          this.props.onEnter(e.target.innerHTML);
        }
      }
    });

    document.getElementById("input").addEventListener("focus", (e) => {
      const input = e.target;
      // Credit to http://stackoverflow.com/a/4238971
      if (
           typeof window.getSelection   !== "undefined"
        && typeof document.createRange  !== "undefined"
      ) {
        const range = document.createRange();
        const sel = window.getSelection();
        range.collapse(true);
        if (input.innerHTML.length) {
          range.setStart(input, 1);
        } else {
          range.setStart(input, 0);
        }
        sel.removeAllRanges();
        sel.addRange(range);
        input.focus();
      } else if (typeof document.body.createTextRange !== "undefined") {
        const textRange = document.body.createTextRange();
        textRange.moveToElementText(input);
        textRange.collapse(false);
        textRange.select();
      }
    });
  }
  shouldComponentUpdate(nextProps) {
    return nextProps.html !== document.getElementById("input").innerHTML;
  }
  handleChange(e) {
    const html = document.getElementById("input").innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      this.props.onChange({
        target: {
          value: html,
        },
      });
    }
    this.lastHtml = html;
  }

  render() {
    return (
      <span>
        &#8203;
        <div
          onInput={(e) => this.handleChange(e)}
          contentEditable
          placeholder={this.props.placeholder}
          dangerouslySetInnerHTML={{ __html: this.props.html }} // eslint-disable-line

          id="input"
          className="searchbar"
          autoFocus
          style={{ backgroundImage: "url(images/google_icon.png)", maxHeight: "28px" }}
        />
        &#8203;
      </span>
    );
  }
}
