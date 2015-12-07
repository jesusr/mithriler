(function() {
  'use strict';
  var todo = {
    Todo: function(data) {
      this.description = m.prop(data.description);
      this.done = m.prop(false);
    },
    TodoList: Array,
    vm: {
      init: function() {
        this.list = new todo.TodoList();
        this.description = m.prop('');
      },
      add: function() {
        if (this.description) {
          this.list.push(new todo.Todo({
            description: this.description()
          }));
          this.description = '';
        }
      }
    },
    controller: function() {
      todo.vm.init();
    },
    view: function() {
      return m('html', [m('body', [m('input', {
        onchange: m.withAttr('value', todo.vm.description),
        value: todo.vm.description()
      }), m('button', {
        onclick: todo.vm.add
      }, 'Add'), m('table', [todo.vm.list.map(function(task) {
        return m('tr', [m('td', [m('input[type=checkbox]', {
          onclick: m.withAttr('checked', task.done),
          checked: task.done()
        })]), m('td', {
          style: {
            textDecoration: task.done() ? 'line-through' : 'none'
          }
        }, task.description()), ]);
      })])])]);
    }
  };
  m.mount(document, {
    controller: todo.controller,
    view: todo.view
  });
  //initialize the application
})();

