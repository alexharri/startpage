module.exports = {
  focusOnInput() {
    // Credit to http://stackoverflow.com/a/4238971
    // Makes caret select end of line
    const input = document.getElementById("input");
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
  },
};
