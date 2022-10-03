const form = document.querySelector('#graphForm')
const y = document.querySelector('#y')
const r = document.querySelector('#r')
const error = document.querySelector('#error')
const table = document.querySelector('#table-body')


function handleError(errorMessage) {
    error.textContent = errorMessage
}

function formatFloat(val) {
    return val.replace(',', '.')
}

function getY() {
    return formatFloat(y.value)
}

function getX() {
    return $('input[name=x]:checked', '#graphForm').val()
}

function getR() {
    return r.value
}

function formatDate(date) {
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return date.toLocaleString('ru', options)
}

function parse_table_element(data) {
    return `
    <tr'>
        <td>${formatDate(new Date(data['datetime'] * 1000))}</td>
        <td>${data['delay']} ms</td>
        <td>${data['x']}</td>
        <td>${data['y']}</td>
        <td>${data['r']}</td>
        <td>${data['result']}</td>
    </tr>
    `
}

function add_element_to_table(data) {
    tableItem = parse_table_element(data)
    table.insertAdjacentHTML('afterbegin', tableItem)
}

function add_elements_to_table(elements) {
    console.log('elements:', elements)
    for (const element of JSON.parse(elements)) {
        add_element_to_table(element)
    }
}

function sendData(event) {
    // validation
    if (!getY()) {
        console.log("can not be empty")
        handleError("Y can not be empty")
        return
    }
    if (!+getY()) {
        console.log("y must be number")
        handleError("Y must be a number")
        return
    }
    if (+getY() > 5 || +getY() < -5) {
        console.log("y must be lower than 5 and higher then -5")
        handleError("Y must be lower than 5 and higher then -5")
        return
    }
    // sending
    formData = {
        'x': getX(),
        'y': getY(),
        'r': getR()
    }
    $.ajax({
        url: 'handler.php/hit',
        data: formData,
        processData: true,
        mimeType: 'multipart/form-data',
        type: 'GET',
        success: function(data){
            add_element_to_table(JSON.parse(data))
        },
        error: function(data) {
            alert(data)
        }
    })
}

function fetchHistory() {
    $.ajax({
        url: 'handler.php/history',
        type: 'GET',
        success: function(data){
            add_elements_to_table(data)
        },
        error: function(data) {
            console.log(data)
            alert(data)
        }
    })
}

form.addEventListener('submit', (event) => {
        console.log("submitting")
        event.preventDefault();
        sendData(event);
    }
)

fetchHistory();
