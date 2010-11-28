function TextFileView() {
    var CONST_marginBottom      = 30;
    var CONST_heightLine        = 16;

    var text_fileDisplaying     = null;         //  !!  IMPORTANT
                                                //  !!
                                                //  !!  The object containing the file contents is kept in a private local variable
                                                //  !!  to prevent other scripts on this page from accessing the file contents.
    var lineRendered            = null;
    var totalHeight             = 0;

    function _processHugeNumberInsertCommas(number) {
        var strNumber = number.toFixed(0).toString();
        var strProcessed = "";
        for (var i = 0; i < strNumber.length; i++) {
            if (i > 0 && i % 3 == 0) strProcessed = ',' + strProcessed;
            strProcessed = strNumber[strNumber.length - 1 - i] + strProcessed;
        }
        return strProcessed;
    }

    this.displayTextFile = function(text_fileDisplay) {
        lineRendered = null;

        text_fileDisplaying = text_fileDisplay;

        var spanStatus = document.getElementById('status');
        spanStatus.innerHTML = "Total Lines:&nbsp;" +
                                _processHugeNumberInsertCommas(
                                                text_fileDisplay.totalLines) +
                                "&nbsp;&nbsp;Total&nbsp;Characters:&nbsp;" +
                                _processHugeNumberInsertCommas(
                                                text_fileDisplay.totalChars);

        // Scroll the viewport back to the top for the new file:
        var divOutput = document.getElementById('output');
        divOutput.scrollTop = 0;

        // Figure out what the height of the viewport should be with the new file:
        totalHeight = text_fileDisplay.totalLines * CONST_heightLine + CONST_marginBottom;

        // Set the new viewport height:
        var divOutputScrolling = document.getElementById('output_scrolling');
        divOutputScrolling.style.height = totalHeight + 'px';
    },

    this.timer = function() {
        var divOutput = document.getElementById('output');
        if (divOutput) {
            if (text_fileDisplaying) {
                var lineStart = Math.floor(divOutput.scrollTop / CONST_heightLine);
                var heightLinePortion = divOutput.scrollTop % CONST_heightLine;

                var preOutputText = document.getElementById('output_text');
                preOutputText.style.top = (divOutput.scrollTop - heightLinePortion) + "px";

                if (lineStart != lineRendered) {
                    var lineEnd = lineStart + 20;
                    var arrText = [];
                    for (var i = lineStart; i < lineEnd && i < text_fileDisplaying.totalLines; i++) {
                        arrText.push(text_fileDisplaying.getLine(i));
                    }
                    while (preOutputText.firstChild) {
                        preOutputText.removeChild(preOutputText.firstChild);
                    }
                    preOutputText.appendChild(document.createTextNode(arrText.join("")));
                    lineRendered = lineStart;
                }
            }
        }

        setTimeout('text_file_view.timer()', 250);
    }

    this.timer();
}
