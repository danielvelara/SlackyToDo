const spanDate = document.getElementById("date");
const spanMonth = document.getElementById("month");
const spanYear = document.getElementById("year");
const spanWeekday = document.getElementById("weekday");
const username = document.getElementById('username');
const todoContainer = document.getElementById('todo-container');

const date = new Date();
const month = date.toLocaleString('default', { month: 'long' });
const myDate = date.getDate();
const year = date.getFullYear();
const day = date.toLocaleDateString('default', { weekday: 'long' });

spanDate.innerText = myDate;
spanMonth.innerText = month;
spanYear.innerText = year;
spanWeekday.innerText = day;

let storedUser;

// checking if user is signed in or not
auth.onAuthStateChanged(user => {
    storedUser = user;
    if (user) {
        fs.collection('users').doc(storedUser.uid).get().then((snapshot) => {
            // console.log(snapshot.data().Name);
            username.innerText = snapshot.data().Name;
        })

        fs.collection(storedUser.uid).onSnapshot((snapshot) => {
            let changes = snapshot.docChanges();

            let rows = [];

            changes.forEach(change => {
                if (change.type == "added") {
                    rows.push(change.doc.data());
                }
                else if (change.type == 'removed') {
                    let li = todoContainer.querySelector('[data-id=' + change.doc.id + ']');
                    todoContainer.removeChild(li);
                }
            });
            renderRows(rows);
        });
    }
    else {
        console.log(user);
        alert('your login session has expired or you have logged out, login again to continue');
        location = "login.html";
    }

    
})

// retriving todos
function renderData(row) {

    // parent div
    let parentTr = document.createElement("tr");
    parentTr.className = "container todo-box";
    parentTr.setAttribute('data-id', row.id);

    // todo div
    let todoTd = document.createElement("td");
    todoTd.textContent = row.todos;
    todoTd.setAttribute("class", "row-data");

    // button

    let trashTd = document.createElement("td");
    let editTd = document.createElement("td");

    let trash = document.createElement("button");
    let edit = document.createElement("button");

    let i = document.createElement("i");
    i.className = "fas fa-trash";

    let e = document.createElement("e");
    e.className = "fas fa-edit";

    let hourTd = document.createElement("td");
    if(row.hour){
        hourTd.textContent = row.hour;
    }

    let descTd = document.createElement("td");
    if(row.desc){
        descTd.textContent = row.desc;
        descTd.setAttribute("class", "row-data");
    }
    // appending
    trash.appendChild(i);
    trashTd.appendChild(trash);
    edit.appendChild(e);
    editTd.appendChild(edit);

    parentTr.appendChild(todoTd);
    parentTr.appendChild(descTd);
    parentTr.appendChild(hourTd);
    parentTr.appendChild(editTd);
    parentTr.appendChild(trashTd);
    todoContainer.appendChild(parentTr);
    

    // trash clicking event
    trash.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        if (storedUser) {
            fs.collection(storedUser.uid).doc(id).delete();
        }
    })

    edit.addEventListener('click', e => {
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        var newName = prompt("Edit task: ");
        if (storedUser) {
            fs.collection(storedUser.uid).doc(id).update({
                todos: newName
            })
            location.reload();
        }
    })
}

// adding todos to firestore database
const form = document.getElementById('form');

form.addEventListener('submit', e => {
    e.preventDefault();
    const todos = form['todos'].value;
    const hour = form['hour'].value;
    const desc = form['desc'].value;
    let id = date.getTime() + 1;
    form.reset();
    if (storedUser) {
        fs.collection(storedUser.uid).doc('_' + id).set({
            id: '_' + id,
            todos,
            hour,
            desc
        }).then(() => {
            console.log('todo added');
            location.reload();
        }).catch(err => {
            console.log(err.message);
        });
    }
})

// logout
function logout() {
    auth.signOut();
}

function compare(a,b) {
    var time1 = parseFloat(a.hour.replace(':','.').replace(/[^\d.-]/g, ''));
    var time2 = parseFloat(b.hour.replace(':','.').replace(/[^\d.-]/g, ''));
    if(a.hour.match(/.*pm/)) time1 += 12; if(b.hour.match(/.*pm/)) time2 += 12;
    if (time1 < time2) return -1;
    if (time1 > time2) return 1;
    return 0;
}   

function renderRows(rows){
    rows.sort(compare);
    rows.forEach(row => {
        renderData(row);
    });
}
