<?php
/**
 * InlineEdit Plugin: Allows visitors to directly edit specially designated 'editable reagions' in a page.
 *
 * @license    GPL 2 (http://www.gnu.org/licenses/gpl.html)
 * @author     Robert Rackl <dokuwiki@doogie.de>
 * @date       December 2012
 */
// must be run within Dokuwiki
if(!defined('DOKU_INC')) die();

/**
 * Dokuwiki syntax plugin "inlineEdit".
 * Allows visitors to directly edit specially designated 'editable reagions' in a page.
 */
class syntax_plugin_inlineEdit extends DokuWiki_Syntax_Plugin {

    /**
     * return some info
     */
    function getInfo(){
        return array(
            'author' => 'Robert Rackl',
            'email'  => 'dokuwiki@doogie.de',
            'date'   => '2012-12-17',
            'name'   => 'InlineEdit Plugin',
            'desc'   => 'Allows visitors to directly edit specially designated editable reagions in a page.',
            'url'    => 'http://dokuwiki.org/plugin:inlineEdit',
        );
    }

    /**
     * What kind of syntax are we?
     */
    function getType(){
        return 'substition';
    }

    /**
     * What about paragraphs?
     */
    function getPType(){
        return 'block';
    }

    /**
     * Where to sort in?
     */
    function getSort(){
        return 777;
    }


    /**
     * Connect pattern to lexer
     */
    function connectTo($mode) {
        $this->Lexer->addSpecialPattern('<editable>.*?<\/editable>',$mode,'plugin_inlineEdit');
    }


    /**
     * Handle the match
     */
    function handle($match, $state, $pos, &$handler){
        $match = substr($match,10,-11); //strip <editable> from start and </editable> from end
        return array($match);
    }

    /**
     * Create HTML for editable region
     */
    function render($format, &$renderer, $data) {
        if($format == 'xhtml'){
            $renderer->doc .= '<p contenteditable="true">';  //This is HTML5 !
			$renderer->doc .= hsc($data);
			$renderer->doc .= '</p>';
            return true;
        }
        return false;
    }



}

//Setup VIM: ex: et ts=4 :
