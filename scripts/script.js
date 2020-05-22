function Erro(msg) {
    let ErrorEl = document.getElementById('Erro');

    ErrorEl.innerText = `${msg}`;
    setTimeout(() => {
        ErrorEl.innerText = '';
    },2500);
}

function setHidden(element) {
    document.getElementById(`${element}`).classList.add('d-hidden');
    document.getElementById(`${element}`).classList.remove('d-visible');
}

function setVisible(element) {
    document.getElementById(`${element}`).classList.remove('d-hidden');
    document.getElementById(`${element}`).classList.add('d-visible');
}


function choose(el) {
    if (el.value == -1) {
        setHidden('searchCEPInputs');
        setHidden('searchInfosInputs');
    }
    else if (el.value == 0) {
        setHidden('searchInfosInputs');
        setVisible('searchCEPInputs');
    }else {
        setHidden('searchCEPInputs');
        setVisible('searchInfosInputs');
    }
}

function infosCEP() {
    let inputEl = document.getElementById('cepValue');
    let loading = true;

    let formatCEP = inputEl.value.replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s])/g, '')

    if (formatCEP.length > 8 || formatCEP.length < 8) {
        Erro('CEP Inválido!');
        setHidden('infos');
    }else {
        fetch(`https://viacep.com.br/ws/${formatCEP}/json/`)
        .then(response => response.json(), loading = false)
        .then(data => {
            if (data.erro === true) {
                Erro('CEP Inexistente!');
                setHidden('infos');
            }else {
                setVisible('infos');

                if (loading === true) {
                    document.getElementById('streetName').value = 'Carregando...';
                    document.getElementById('cityName').value = 'Carregando...';
                    document.getElementById('state').value = 'Carregando...';
                }else {
                    document.getElementById('streetName').value = `${data.logradouro}`;
                    document.getElementById('cityName').value = `${data.localidade}`;
                    document.getElementById('state').value = `${data.uf}`;
                }
            }
        })
        .catch( error => console.error('Error ' + error));
    }
}

function searchCEP() {
    let streetName = document.getElementById('nameRua');
    let city = document.getElementById('cidade');
    let uf = document.getElementById('uf');
    let loading = true ;

    let formatUF = uf.value.toUpperCase();

    if (streetName.value.length === 0 || city.value.length === 0 || uf.value.length === 0) {
        Erro('O três campos necessitam ser preenchidos!');
    }else {
        setVisible('valueCEP');

        fetch(`https://viacep.com.br/ws/${formatUF}/${city.value}/${streetName.value}/json/`)
        .then(response => response.json(), loading = false)
        .then(data => {
            console.log(data)
            if (data.erro === true) {
                Erro('CEP não encontrado!');
                setHidden('cep');
            }else {
                setVisible('cep');

                if (loading === true) {
                    document.getElementById('cep').value = 'Carregando...';
                }else {
                    document.getElementById('cep').value = `${data[0].cep}`;
                }
            }
        })
        .catch( error => console.error('Error ' + error));
    }
}