(function($)
  {
  'use strict';

  // from http://stackoverflow.com/questions/499126/jquery-set-cursor-position-in-text-area
  $.fn.selectRange = function(start, end) {
      if(typeof end === 'undefined') {
          end = start;
      }
      return this.each(function() {
          if('selectionStart' in this) {
              this.selectionStart = start;
              this.selectionEnd = end;
          } else if(this.setSelectionRange) {
              this.setSelectionRange(start, end);
          } else if(this.createTextRange) {
              var range = this.createTextRange();
              range.collapse(true);
              range.moveEnd('character', end);
              range.moveStart('character', start);
              range.select();
          }
      });
  };;

  function renderReportNode(element, tagname)
    {
    var node = $('<' + (tagname||'div') + '>');

    if (element.type)
      node.addClass(element.type);

    if (element.tags && element.tags.length)
      {
      var tags = $('<span>').addClass('tags').appendTo(node);
      element.tags.forEach(function(tag) { $('<span>').addClass('tag').text(tag.name).appendTo(tags); });
      }

    if (element.keyword)
      $('<span>').addClass('keyword').text(element.keyword).appendTo(node);
    if (element.name)
      $('<span>').addClass('name').text(element.name).appendTo(node);
    if (element.description)
      $('<p>').addClass('description').text(element.description).appendTo(node);
    if (element.doc_string)
      $('<details>').addClass('doc_string').text(element.doc_string.value).appendTo(node);

    if (element.result)
      {
      node.addClass(element.result.status || 'undefined');
      if (element.result.error_message)
        $('<div>').addClass('error').text(element.result.error_message).appendTo(node);
      }

    if (element.embeddings)
      element.embeddings.forEach(function(attachment)
        {
        if (attachment.mime_type == 'text/plain' || attachment.mime_type == 'application/json')
          {
          var text = window.atob ? window.atob(attachment.data) : '<base-64-encoded>';
          $('<div>').addClass('embedding').text(text).appendTo(node);
          }
        });

    return node;
    }

  function renderFeature(feature, root)
    {
    var node = renderReportNode(feature, 'div');
    node.addClass('cucumber-report').appendTo(root);

    if (feature.elements)
      feature.elements.forEach(function(element)
        {
        renderElement(element, node);
        });
    }

  function renderElement(element, root)
    {
    var node = renderReportNode(element, 'section');

    if (element.steps)
      {
      var ol = $('<ol>').addClass('steps').appendTo(node);
      element.steps.forEach(function(step)
        {
        if (!step.hidden)
          renderReportNode(step, 'li').appendTo(ol);
        });
      }

    node.appendTo(root);
    }

  function scrollIntoView(element)
    {
    $(window).scrollTop($(element).position().top);
    }

  function runFeature()
    {
    var output          = $('#output');
    var outputPanel     = $('#panel-output');
    var errors          = $('#errors');
    var errorsContainer = $('#errors-container').hide();
    var featureSource   = $('#feature').val();
    var postdata = { feature: editor.getValue() };

    // clear output container
    output.html('');
    output.append($('<span>').addClass('loading').text('Running feature...'));
    outputPanel.collapse('show');

    // submit feature for execution
    $.ajax({
      url: '/run',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(postdata),
      dataType: 'json',
      })
      .done(function(results, status, jqXHR)
        {
        console.log(results);
        output.html('');

        // render results as HTML into output
        if (results.length)
          $.each(results, function(i, feature) { renderFeature(feature, output); });

        scrollIntoView(outputPanel);
        })
      .fail(function(err)
        {
        errors.html(err.statusText + "<br/>" + err.responseText);
        errorsContainer.show().collapse('show');
        scrollIntoView(errorsContainer);
        });
    }

  // initialize ACE
  var editor = ace.edit("feature");
  editor.getSession().setMode("ace/mode/gherkin");
  editor.setShowPrintMargin(false);
  editor.getSession().setTabSize(2);
  editor.getSession().setUseSoftTabs(true);

  // register button actions
  $('#run-feature').click(runFeature);
  $('#right-accordion').on('click', '.panel-collapse .btn-copy', function(e)
    {
    var source = $(e.target).parent().find('.panel-body.pre').text();
    // alert about replacing unsaved data?
    //$('#feature').val(source).focus().selectRange(0,0).scrollTop(0);
    editor.setValue(source);
    editor.gotoLine(0);
    editor.focus();
    });


  // load feature reference
  $.get('/reference', function(data)
    {
    $('#feature-reference .panel-body').text(data);
    });

  // load feature reference
  $.get('/features', function(data)
    {
    // render collapsible panel for each feature
    $.each(data, function(j, feature)
      {
      $('<div class="panel panel-default">')
        .append(
          $('<div class="panel-heading" role="tab">')
            .append(
              $('<h4 class="panel-title" role="button" data-toggle="collapse" data-parent="#right-accordion" aria-expanded="false">')
                .attr('href', '#feature-'+j)
                .attr('aria-controls', 'feature-'+j)
                .text(feature[0])
            )
        )
        .append(
          $('<div class="panel-collapse collapse" role="tabpanel">')
            .attr('id', 'feature-'+j)
            .append(
              $('<div class="panel-body pre">').text(feature[1])
            )
            .append(
              $('<a class="btn btn-info btn-xs btn-copy">').text('Copy')
            )
        )
        .appendTo('#right-accordion');
      });
    });

  })(jQuery);
