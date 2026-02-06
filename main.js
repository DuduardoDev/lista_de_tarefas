$(document).ready(function () {

      $('#lista').sortable({
    axis: 'y',
    update: function () {
      salvarTarefas();
    }
  });

  carregarTarefas();

  $('#form').submit(function (e) {
    e.preventDefault();

    const texto = $('#tarefa').val().trim();
    if (texto === '') return;

    criarTarefa(texto, false);
    $('#tarefa').val('');
    salvarTarefas();
  });

  $('#lista').on('change', 'input[type="checkbox"]', function () {
    const li = $(this).closest('li');

    if (li.hasClass('editando')) {
      this.checked = !this.checked;
      return;
    }

    li.toggleClass('feito', this.checked);
    salvarTarefas();
    ordenarTarefas();
  });

  $('#lista').on('click', '.editar', function () {
    const li = $(this).closest('li');
    const span = li.find('.texto');

    if (li.hasClass('feito') || li.hasClass('editando')) return;

    li.addClass('editando');

    const textoAtual = span.text();
    const input = $('<input type="text" class="input-editar">');
    input.val(textoAtual);

    span.replaceWith(input);
    input.focus();

    input.on('blur keydown', function (e) {
      if (e.type === 'blur' || e.key === 'Enter') {
        const novoTexto = input.val().trim();
        const novoSpan = $('<span class="texto"></span>');

        novoSpan.text(novoTexto !== '' ? novoTexto : textoAtual);
        input.replaceWith(novoSpan);

        li.removeClass('editando');
        salvarTarefas();
      }
    });
  });

  $('#lista').on('click', '.remover', function () {
    $(this).closest('li').remove();
    salvarTarefas();
  });


  function criarTarefa(texto, feita) {
    const li = $(`
      <li class="tarefa ${feita ? 'feito' : ''}">
        <label class="check">
          <input type="checkbox" ${feita ? 'checked' : ''}>
          <span class="checkmark"></span>
        </label>

        <span class="texto">${texto}</span>

        <div class="acoes">
          <button class="editar">✏️</button>
          <button class="remover">✖</button>
        </div>
      </li>
    `);

    $('#lista').append(li);
    ordenarTarefas();
  }

  function salvarTarefas() {
    const tarefas = [];

    $('#lista li').each(function () {
      tarefas.push({
        texto: $(this).find('.texto').text(),
        feita: $(this).hasClass('feito')
      });
    });

    localStorage.setItem('tarefas', JSON.stringify(tarefas));
  }

  function carregarTarefas() {
    const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
    tarefas.forEach(t => criarTarefa(t.texto, t.feita));
  }

  function ordenarTarefas() {
    const pendentes = $('#lista li').not('.feito');
    const concluidas = $('#lista li.feito');

    $('#lista').append(pendentes).append(concluidas);
  }

});
