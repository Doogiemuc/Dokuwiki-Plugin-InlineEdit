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
    stripHtml:  true
  },

  /**
   * initialize the given paragraph element as an editable paragraph.
   * @param elem a CSS selector that jQuery understands, e.g. "div.p"
   */
  init: function(el) {
    var self = this;
    this.elem = $(el);
    this.elem.hover(
      function() { self.elem.addClass("editableHighlight"); },
      function() { self.elem.removeClass("editableHighlight"); }
    );

    this.elem.dblclick(function(event) {
      debout("elem="+self.elem);
      self.startEditing(self.elem);
    });
  },

  /**
   * start editing a paragraph
   * param  the <p> [HTMLObject] (You can simply pass 'this' from the paragraphs onDoubleClick handler.)
   */
  startEditing: function(elem) {
    debout("startEditing:"+elem);
    //--- create new textarea
    this.originalText   = this.elem.html().replace(/<br>/gi,"\n");
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
      //DEBUG: $(element).after("<pre>"+styleNames[i]+"="+$(element).css(styleNames[i])+"</pre>");
      this.input.css(styleNames[i], this.elem.css(styleNames[i]));
    }
    //MAYBE: this.input.css('left-margin', $(element).css('left-margin')-1);
    
    //--- hide original paragraph and replace it with the new textarea
    this.elem.css({'visibility':'hidden', 'position':'absolute'});
    this.input.insertAfter(this.elem);
    this.input.focus();
    //MAYBE: fire event this.onLoad(element,input);        
  },
  
  /**
   * Called after a key has been pressed and released. 
   * Updates the content of the (invisible) paragraph.
   * Adjusts the height of the textfield if the return key has been pressed.
   * When user pressed escape, then the original content of the paragraph will be restored.
   */
  keyup: function(e) {
    debout("keyup: type="+e.type+" "+e.which);
    this.elem.html( e.which==13 ? this.getContent()+"&nbsp;" : this.getContent() ); // enter key
    var self=this;
    if(e.which==13) { 
      this.input.bind('keydown.editable4', function(event) { self.newLine() });
    }
    this.input.height(this.elem.height());
    if (e.which==27) {  // escape key
      this.elem.text(this.originalText);
      this.endEditing();
    }
  },
  
  /** 
   * returns the content of the input textarea. 
   * html tags will be stripped if option 'stripHtml' is true.
   * Newline characters will then be replaced by <br> tags.
   */
  getContent: function() {
    var content = this.input.val();
    if(this.options.stripHtml) content = content.replace(/(<([^>]+)>)/ig,"");
    return(content.replace(/\n/gi,"<br>"));
  },
  
  newLine: function() {
    debout("newLine");
    this.elem.html(this.elem.html().replace("&nbsp;",""));
	this.input.unbind('keydown.editable4');  // remove event handler
  },
  
  complete: function(e) {
    debout("complete: type="+e.type);
    this.elem.html(this.getContent());
    this.endEditing();
  },
  
  endEditing: function() {
    debout("end event");
    this.input.remove(); // delete textarea
    this.elem.css({'visibility':'visible', 'position':'relative', 'width':this.originalWidth});
  }
}

var debmsg = "";
debout = function(msg) {
  msg.replace("<", "&lt;");
  msg.replace(">", "&gt;");
  debmsg += msg + "<br/>";
  $("#deb").html("<pre>"+debmsg+"</pre>");
}

/**
 * attach editable functionality to each paragraph that has the class 'editable'
 */
$(document).ready( function() {
  
  /** highlight every editable paragraph on mouseOver */
  editable4.init("p.editable")
  
  
  /** start editing onDoubleClick 
  $("p.editable").dblclick(function() {
    editable4.startEditing(this);
  });
  */  
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