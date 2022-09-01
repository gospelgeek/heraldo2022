function getValueInputs(pag) {

    let page_8 = {
        page: pag,
        cbox1: $('#cbox1').is(":checked"),
        cbox2: $('#cbox2').is(":checked"),
        cbox3: $('#cbox3').is(":checked"),
        cbox4: $('#cbox4').is(":checked"),
        cbox5: $('#cbox5').is(":checked"),
        cbox6: $('#cbox6').is(":checked"),
        input2: $('#input2').val(),
        input3: $('#input3').val(),
        input4: $('#input4').val(),
        input5: $('#input5').val(),
        input6: $('#input6').val(),
        input7: $('#input7').val()
    }

    localStorage.setItem('data', JSON.stringify(page_8))

    setValueInputs()
}

function setValueInputs() {
    var currentPage = $('.magazine').turn('page');
    var data = JSON.parse(localStorage.getItem('data'));

    if (data && data.page == currentPage) {
        Object.entries(data).forEach(([id, value]) => {
            if (value == true || value == false) {
                $("#" + id).prop('checked', value);
            } else {
                $('#' + id).val(value)
            }
        });
    }
}

document.body.onload = setTimeout(setValueInputs, 2000);