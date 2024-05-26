$(document).ready(function () {
  $('#tableScore').DataTable({
    ajax: {
      url: '../src/score.json',
      dataSrc: ''
    },
    columns: [{ data: 'nom' }, { data: 'score' }, { data: 'date' }]
  })
})
