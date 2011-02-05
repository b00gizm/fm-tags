(function($) {
  
  $.fn.fmtag = function(settings) {
    
    if (settings) {
      $.extend($.fn.fmtag.defaults, settings);
    }
    
    this.each(function() {
      
      var elem = $(this);
      
      var tagInput = $("<input>").attr({ type: "text", size: "1" });
      var resListContainer = $("<div>").addClass("fmtag-results");
      var resList = $("<ul>");
      
      var Event = {
        KEY_BACKSPACE : 8,
        KEY_ENTER     : 13,
        KEY_ESC       : 27,
        KEY_SPACE     : 32,
        KEY_LEFT      : 37,
        KEY_UP        : 38,
        KEY_RIGHT     : 39,
        KEY_DOWN      : 40
      }
      
      var tagList = [];
      
      elem.addClass("fmtag").bind("click", function(e) {
        tagInput.focus();
      });
      
      resListContainer.append(resList);
      elem.append(tagInput).after(resListContainer);
      
      tagInput.bind("keydown", function(e) {
        var key = e.keyCode;
        switch (key) {
          case Event.KEY_SPACE:
          case Event.KEY_ENTER:
            var value = resListContainer.is(":visible") ? resList.find("li.selected").text() : $(this).val();
            hideAutocompleteResults();
            if ($.trim(value).length > 0) {
              createTag(value);
            }
            break;
          case Event.KEY_BACKSPACE:
          case Event.KEY_LEFT:
            if ($(this).val() == "") {
              var tagAnchor = $(this).prev("a") || false;
              if (tagAnchor && tagAnchor.hasClass("selected")) {
                if (key == Event.KEY_BACKSPACE) {
                  removeTag(tagAnchor);
                }
              }
              else {
                tagAnchor.addClass("selected")
                  .css({
                    "color"            : $.fn.fmtag.defaults.tagSelTextColor,
                    "background-color" : $.fn.fmtag.defaults.tagSelBgColor
                  });
              } 
            }
            break;
          case Event.KEY_RIGHT:
            if ($(this).val() == "") {
              var tagAnchor = $(this).prev("a") || false;
              if (tagAnchor && tagAnchor.hasClass("selected")) {
                  tagAnchor.removeClass("selected")
                    .css({
                      "color"            : $.fn.fmtag.defaults.tagTextColor,
                      "background-color" : $.fn.fmtag.defaults.tagBgColor
                    });
              }
            }
            break;
          case Event.KEY_UP:
          case Event.KEY_DOWN:
            e.preventDefault();
            if (resListContainer.is(":visible")) {
              var numListElems = resList.children().length;
              var selListElem = resList.find("li.selected");                   
              var listElemIndex = selListElem.data("listElemIndex");
              if (listElemIndex < (numListElems-1) && key == Event.KEY_DOWN) {
                listElemIndex += 1;
              }
              else if (listElemIndex > 0 && key == Event.KEY_UP) {
                listElemIndex -= 1;
              }

              selListElem.removeClass("selected");
              $(resList.children().get(listElemIndex))
                .addClass("selected")
                .data("listElemIndex", listElemIndex);
            }
            break;
          case Event.KEY_ESC:
            hideAutocompleteResults();
            break;
          default:
            break;
        }
      })
      .bind("keyup", function(e) {
        var key = e.keyCode;
        switch (key) {
          case Event.KEY_SPACE:
          case Event.KEY_ENTER:
          case Event.KEY_UP:
          case Event.KEY_DOWN:
          case Event.KEY_ESC:
            break;
          default:
            hideAutocompleteResults();
            var entry = $(this).val();
            if (entry.length > 0) {
              var res = $.grep($.fn.fmtag.defaults.autocompleteData, function(data) {
                var regex = new RegExp("^" + entry, "g");
                return data.match(regex);
              });

              if (res.length > 0) {
                $.each(res, function(idx, value) {
                  var listElem = $("<li><a href='#'>" + value + "</a></li>")
                    .data("listElemIndex", idx)
                    .click(function(e) {
                      listElem = $(this);
                      createTag(listElem.children("a").text());
                      hideAutocompleteResults();
                    });
                  
                  if (idx == 0) {
                    listElem.addClass("selected");
                  }
                  resList.append(listElem);
                });

                resListContainer.show();
              }
            }
            break;
        }
      })
      .bind("focus", function(e) {
        $(this).data("hasFocus", true)
          .parent().find("a.fmtag-tag")
            .removeClass("selected")
            .css("background-color", $.fn.fmtag.defaults.tagBgColor);
      });
      
      // function: createTag
      function createTag(value) {
        var tagAnchor = null;
        if ($.inArray(value, tagList) == -1) {
          tagAnchor = $("<a>").addClass("fmtag-tag").click(function(e) {
            e.stopPropagation();
            $(this).addClass("selected")
              .css({
                "color"            : $.fn.fmtag.defaults.tagSelTextColor,
                "background-color" : $.fn.fmtag.defaults.tagSelBgColor
              });
          });

          var innerSpan = $("<span>").text(value);
          var removeBtn = $("<span>").addClass("fmtag-remove").click(function(e) {
            var tagAnchor = $(this).parents("a").get(0);
            $(tagAnchor).remove();
            removeTag(tagAnchor);
          });

          innerSpan.append(removeBtn);
          tagAnchor.append(innerSpan);

          tagList.push(value);
          $.fn.fmtag.defaults.onChange(tagList);

          tagAnchor.css({
            "color"            : $.fn.fmtag.defaults.tagTextColor,
            "background-color" : $.fn.fmtag.defaults.tagBgColor
          });

          tagInput.before(tagAnchor);
        }
        
        tagInput.val("").focus();
      }
      
      function removeTag(tagAnchor) {
        $(tagAnchor).remove();
        
        var idx = -1;
        var value = $(tagAnchor).children("span").text();
        if ((idx = $.inArray(value, tagList)) != -1)
        {
          tagList = $.grep(tagList, function(data) {
            return (data != value);
          });
        }
        
        $.fn.fmtag.defaults.onChange(tagList);
      }
      
      // function: hideAutocompleteResults
      function hideAutocompleteResults() {
        resList.html("");
        resListContainer.hide();
      }
      
    });
    
    return this;
    
  },
  
  $.fn.fmtag.defaults = {
    
    // Autocomplete data
    autocompleteData: [],
    
    // Colors
    tagBgColor      : "#CCCCCC",
    tagTextColor    : "#000000",
    tagSelBgColor   : "#0060E9",
    tagSelTextColor : "#FFFFFF",
    
    // Callbacks
    onChange        : function() {}
    
  }
  
})(jQuery);
