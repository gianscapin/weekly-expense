// Variables y selectores

const form = document.getElementById('agregar-gasto');

const spendingList = document.querySelector('#gastos ul');

let presupuesto;





// Eventos

eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',askWallet);

    form.addEventListener('submit', addSpending);
}




// Clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    addSpending(gasto){
        this.gastos.push(gasto);
        this.restante -= gasto.cantidad;
    }

    deleteSpending(id){
        let spend = this.gastos.find(gasto => gasto.id == id);
        this.gastos = this.gastos.filter(gasto => gasto.id !=id);
        this.restante += Number(spend.cantidad);

    }

}

class UI{
    insertarPresupuesto(cantidad){
        const {presupuesto, restante} = cantidad;
        document.getElementById('total').textContent = presupuesto;
        document.getElementById('restante').textContent = restante;
    }

    insertSpending(gasto){
        spendingList.innerHTML = ``;
        gasto.forEach((spending)=>{
            
            console.log(spending)

            // CREAR LI

            const newSpending = document.createElement('li')
            newSpending.className = 'list-group-item d-flex justify-content-between align-items-center'
            newSpending.setAttribute('data-id',spending.id);

            // Agregar HTML

            newSpending.innerHTML = `${spending.nombre} <span class="badge badge-primary badge-pill">$ ${spending.cantidad}</span>
            `;

            // Boton para borrar el gasto

            const btnBorrar = document.createElement('button')

            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto')
            btnBorrar.textContent = 'Borrar'
            btnBorrar.onclick = () =>{
                deleteSpending(spending.id);
            }

            newSpending.appendChild(btnBorrar)

            // Agregar al HTML

            spendingList.appendChild(newSpending)



        })
    }

    printAlert(message, type){
        const divMessage = document.createElement('div')
        divMessage.classList.add('text-center', 'alert')

        if(type === 'error'){
            divMessage.classList.add('alert-danger')
        }else{
            divMessage.classList.add('alert-success')
        }

        divMessage.textContent = message;

        document.querySelector('.primario').insertBefore(divMessage,form)

        
        setTimeout(()=>{
            divMessage.remove()
        },3000)
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        if(restante<(presupuesto/4)){
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if(restante<(presupuesto/2)){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if(restante<0){
            ui.printAlert('El presupuesto se agotó.','error');
            form.querySelector('button[type="submit"]').disabled = true;

        }
    }
}

const ui = new UI();


// Funciones

function askWallet(){
    const wallet = prompt('Cuál es tu presupuesto?');

    if(wallet<=0 || wallet === null || isNaN(wallet)){
        window.location.reload()
    }

    presupuesto = new Presupuesto(wallet);
    ui.insertarPresupuesto(presupuesto);
}

function addSpending(e){
    e.preventDefault();

    const nombre = document.getElementById('gasto').value;
    const cantidad = document.getElementById('cantidad').value;

    if(nombre === '' || cantidad === ''){
        ui.printAlert('Ambos campos son obligatorios', 'error')
    }else if(cantidad<=0 || isNaN(cantidad)){
        ui.printAlert('La cantidad no es válida', 'error')
    }

    const spending = {nombre, cantidad, id: Date.now()}

    presupuesto.addSpending(spending)
    ui.insertarPresupuesto(presupuesto)

    ui.printAlert('Gasto agregado!')
    ui.insertSpending(presupuesto.gastos)
    ui.comprobarPresupuesto(presupuesto)


    form.reset()

}

function deleteSpending(id){
    presupuesto.deleteSpending(id)
    ui.insertarPresupuesto(presupuesto);

    ui.printAlert('Gasto eliminado!')
    ui.insertSpending(presupuesto.gastos)
    ui.comprobarPresupuesto(presupuesto)

}