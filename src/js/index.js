$(document).ready(function () {
  $('#tableScore').DataTable({
    ajax: {
      url: 'https://maxouch742.github.io/sommet-suisse/src/score.json',
      dataSrc: ''
    },
    columns: [{ data: 'nom' }, { data: 'score' }, { data: 'date' }],
    order: [[1, 'desc']]
  })
})
