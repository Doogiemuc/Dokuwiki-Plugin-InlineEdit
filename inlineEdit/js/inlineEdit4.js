/**
 * === Inline Edit 4 ===
 *
 * Makes a paragraph of text editable within an HTML page.
 *
 * REQUIRES  jQuery.js 
 *
 * @author   Robert Rackl <inlineEdit4@doogie.de>
 * @date     December 2012
 * @see      http://dev.justinmaier.com/inlineEdit3/index.html
 * 
 */

/** 
 * main editable4 object ("class")
 */
var editable4 = {

  options: {
    inputClass: 'editableTextarea',
    stripHtml: false
  },
  
  htmlFragments: {
    hoverMsg: '<div class="hoverMsg">Doubleclick to edit</div>',
  },

  /**
   * initialize the given paragraph element as an editable paragraph.
   * @param el a CSS selector that jQuery understands, e.g. "div.p"
   */
  init: function(el) {
    var self = this;
    this.elem = $(el);

    //-- put an invisible pixelDiv before the paragraph so that we can position popups relatively to this coordinates.
    this.pixelDiv = $('<div class="editablePixel" />');
    this.hoverDiv = $(this.htmlFragments.hoverMsg);
    this.pixelDiv.append(this.hoverDiv);
    this.pixelDiv.insertBefore(this.elem);
    
    this.elem.hover(
      function() { 
        self.elem.addClass("editableHighlight"); 
        self.hoverDiv.show(100);
      },
      function() { 
        self.elem.removeClass("editableHighlight"); 
        self.hoverDiv.hide(100);
      }
    );
    
    this.elem.dblclick(function(event) {
      self.hoverDiv.hide();
      self.startEditing(self.elem);
    });
  },

  /**
   * start editing a paragraph
   * @param elem a jQuery object representing the paragraph to edit
   */
  startEditing: function(elem) {
    //debout("startEditing:"+elem);
    //--- create new textarea
    this.originalText   = this.elem.html().replace(/<br>/gi,"\n")
    if (this.originalText == "&nbsp;") this.originalText = "";
    this.originalWidth  = this.elem.width();
    this.input = $('<textarea></textarea>');
    this.input.addClass(this.options.inputClass);
    this.input.val(this.originalText); 
        
    //--- hock into events
    var self=this;  
    this.input.keyup( function(event) {
      self.keyup(event);
    });
    this.input.blur( function(event) { 
      self.complete(event); 
    });
    
    //---  copy all styles from editable paragraph to new textarea
    var styleNames = ['width','height','padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','font-family','font-size','font-weight','line-height','border-top','border-right','border-bottom','border-left','background-color','color'];
    for (var i in styleNames) {
      this.input.css(styleNames[i], this.elem.css(styleNames[i]));
    }
    
    //--- hide original paragraph and replace it with the new textarea
    this.elem.css({'visibility':'hidden', 'position':'absolute'});
    this.input.insertAfter(this.elem);
    this.input.focus();
  },
  
  /**
   * Called after a key has been pressed and released. 
   * Updates the content of the (invisible) paragraph.
   * Adjusts the height of the textfield (Necessray, when the return key has been pressed.)
   * When user pressed escape, then the original content of the paragraph will be restored.
   */
  keyup: function(e) {
    //debout("keyup: type="+e.type+" "+e.which);
    this.elem.html( this.getContent()+"&nbsp;" ); // add space to force increase of height with last empty newline
    this.input.height( this.elem.height() );
    if (e.which==27) {  // escape key
      this.elem.html(this.originalText.replace(/\n/gi,"<br>"));
      this.endEditing();
    }
  },
  
  /** 
   * returns the (textual) value of the input <textarea> as valid HTML
   * If stripHtml is true, then html tags that have been entered will be removed.
   * Newline characters from the textarea will always be returned as <br>
   */
  getContent: function() {
    var content = this.input.val();
    //fix "partly entered" HTML tags where closing ">" is still missing.
    content = content.replace(/<(\/?)(\w+)\b([^>])/ig, "&lt;$1$2$3");
    content = content.replace(/<\/(\W)/ig, "&lt;/$1");
    if(this.options.stripHtml) content = content.replace(/(<([^>]+)>)/ig,"");
    content = content.replace(/\n/gi,"<br>");
    //debout("getContent()=#"+content+"#");
    return(content);
  },
  
  /**
   * sets the html of the original paragraph to the entered text and ends editing.
   */ 
  complete: function(e) {
    //debout("complete: type="+e.type);
    var content = this.getContent();
    content = content.replace(/(<br>)+$/, "");  // delete empty trailing lines
    if (content.length == 0) content = "&nbsp"; // prevent empty paragraph, cause it would have height==0
    this.elem.html(content);
    this.endEditing();
  },
  
  /**
   * removes the input textarea and displays the original paragraph again (with its new content)
   */
  endEditing: function() {
    //debout("end event");
    this.input.remove(); // delete textarea
    this.elem.css({'visibility':'visible', 'position':'relative', 'width':this.originalWidth});
  }
}

var debmsg = "";
debout = function(msg) {
  msg = msg.replace(/&/ig, "&amp;");
  msg = msg.replace(/</ig, "&lt;");
  msg = msg.replace(/>/ig, "&gt;");
  debmsg += msg + "<br/>";
  $("#deb").html("<pre>"+debmsg+"</pre>");
}

/**
 * attach editable functionality to each paragraph that has the class 'editable'
 */
$(document).ready( function() {
  
  /** highlight every editable paragraph on mouseOver */
  editable4.init("p.editable")
  

});
 
 
 
 
function DumpObjectIndented(obj, indent)
{
  var result = "";
  if (indent == null) indent = "";

  for (var property in obj)
  {
    var value = obj[property];
    if (typeof value == 'string')
      value = "'" + value + "'";
    else if (typeof value == 'object')
    {
      if (value instanceof Array)
      {
        // Just let JS convert the Array to a string!
        value = "[ " + value + " ]";
      }
      else
      {
        // Recursive dump
        // (replace "  " by "\t" or something else if you prefer)
        var od = DumpObjectIndented(value, indent + "  ");
        // If you like { on the same line as the key
        //value = "{\n" + od + "\n" + indent + "}";
        // If you prefer { and } to be aligned
        value = "\n" + indent + "{\n" + od + "\n" + indent + "}";
      }
    }
    result += indent + "'" + property + "' : " + value + ",\n";
  }
  return result.replace(/,\n$/, "");
}
 
 
/*
Post parameter for SAVE request


$_POST	Array [11]	
	[0...10]	
		sectok	2e3b971308861ce01303139b2a78124d	
		id	start	
		rev	0	
		date	1355660655	
		prefix	.	
		suffix	
		changecheck	371c8dc799ea2d7e9366de0c91b797de	
		target	section	
		wikitext	====== 1. LocalTestWiki ======\r\n\r\nFirst paragraph\r\n\r\n===== 2.1 Second Headline =====\r\n\r\nSecond Pragasdföj newWord alksjf \r\n\r\n===== 2.2. Headline =====\r\n\r\nand so forth	
		do	Array [1]	
			[0...0]	
				save	Save	
		summary	saveaction	
*/