// Class that creates a Bootstrap modal
export default class Modal
{
  // Constructor
  constructor(options)
  {
    this.options = options;

    // Create the modal
    this.modalDiv = $(document.createElement('div'))
      .addClass('modal fade')
      .attr('role', 'dialog')
      .appendTo('body');

    // Create the dialog
    let modalDialogDiv = $(document.createElement('div'))
      .addClass('modal-dialog modal-dialog-centered modal-lg')
      .attr('role', 'document')
      .appendTo((this.modalDiv));
    let modalContentDiv = $(document.createElement('div'))
      .addClass('modal-content')
      .appendTo(modalDialogDiv);

    // Create the header
    let modalHeaderDiv = $(document.createElement('div'))
      .addClass('modal-header')
      .appendTo(modalContentDiv);
    let modalTitleDiv = $(document.createElement('h5'))
      .addClass('modal-title')
      .html(options.title)
      .appendTo(modalHeaderDiv);
    let modalCloseButton = $(document.createElement('button'))
      .addClass('close')
      .attr('type', 'button')
      .attr('data-dismiss', 'modal')
      .html('&times;')
      .appendTo(modalHeaderDiv);

    // Create the body
    let modalBodyDiv = $(document.createElement('div'))
      .addClass('modal-body')
      .html(options.body)
      .appendTo(modalContentDiv);

    // Create the footer
    this.buttons = [];
    if (typeof options.buttons !== 'undefined')
    {
      let modalFooterDiv = $(document.createElement('div'))
        .addClass('modal-footer')
        .appendTo(modalContentDiv);

      for (let buttonOptions of options.buttons)
      {
        let button = $(document.createElement('button'))
          .addClass('btn')
          .html(buttonOptions.title)
          .appendTo(modalFooterDiv);
        if (buttonOptions.class !== undefined)
          button.addClass(buttonOptions.class);
        if (buttonOptions.dismiss !== undefined)
          button.attr('data-dismiss', buttonOptions.dismiss);
        if (buttonOptions.onclick !== undefined)
          button.on('click', buttonOptions.onclick);

        this.buttons.push(button);
      }
    }

    // Initialize the modal
    this.modalDiv.modal({
      backdrop: options.backdrop !== undefined ? options.backdrop : true,
      keyboard: options.keyboard !== undefined ? options.keyboard : true,
      focus: options.focus !== undefined ? options.focus : true,
      show: false
    });
  }

  // Show the modal
  show()
  {
    this.modalDiv.modal('show');
    return this;
  }
}
