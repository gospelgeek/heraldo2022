$(window).load(function() {
    setTimeout(function() {
        $('#loading').hide();
        $('#btn-presidente').on('click', () => {
            $('.read-more-box').removeClass('display-none')
            $('.read-more-text').html(`<iframe width='100%' height='100%' src="https://www.youtube.com/embed/6k_p35FhaQQ" title='Secretario General Heraldo 09 junio 2022 11 18 09 a m' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>`)
        })
    }, 1000);
});
