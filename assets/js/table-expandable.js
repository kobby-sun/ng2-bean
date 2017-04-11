(function ($) {
    $(function () {
        $('.table-expandable').each(function () {
            var table = $(this);
            //table.children('thead').children('tr').append('<th></th>');
            table.children('tbody').children('tr').filter(':odd').hide();
            table.children('tbody').children('tr').filter(':even').find('.table-row-toggle').click(function () {
                var element = $(this);
				var tr = element.closest('tr')
                tr.next('tr').toggle();
                //element.find(".table-row-toggle").toggleClass("up");
            });
            //table.children('tbody').children('tr').filter(':even').each(function () {
            //    var element = $(this);
                //element.append('<td><div class="table-expandable-arrow"></div></td>');
            //});
        });
    });
})(jQuery); 