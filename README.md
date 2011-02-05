fm-tags is a jQuery plugin for adding a tagging input field to your site. It looks and behaves like the tag input fields found at [LastFM](http://www.last.fm).

Key features
============

* a nice UI for tag management
* key-bindings for full keyboard control
* (basic) auto completion
* custom javascript callbacks
* other customization options

Requirements
============

jQuery >= 1.3.2

Usage example
=============

    $(document).ready(function() {
      
      $('.tagger').fmtag({
        
        autocompleteData: ['github', 'awesome', 'jquery', 'iPhone', 'iPad', 'iPod'],
        
        onChange: function(tagList) {
          // Do stuff ...
        }
      });
      
    });
    
Notes
=====

For auto completion, you can provide a Javascript Array with all possible tags as strings. 
No Ajax love involved yet, - as I told you, it's still very basic ;)
