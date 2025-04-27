const tasks = JSON.parse(localStorage.getItem("tasks"));
console.log(tasks)
const container = document.getElementById("tasksContainer");
const currentUser = JSON.parse(localStorage.getItem("currentUser"))
for(let i=0; i< tasks.length; i++){
    let task = tasks[i];
    if(task.creator === currentUser.username){
        const card = document.createElement(`div`);
        card.style.background = getPriorityColor(task.priority);
        card.innerHTML = `<div class="card" style="width: 18rem;">
         <div class="card-body">
         <h5 class="card-title"><strong>description: ${task.description}</strong></h5>
         <h6 class="card-subtitle mb-2 text-body-secondary">Date: ${task.date}</h6>
         <p class="card-text">Start Time: ${task.startTime}</p>
         <h6 class="card-text">priority: ${task.priority}</h6>
         <h6 class="card-text">task status: ${task.status}</h6>
         </div>
         </div>
        _____ `
        container.append(card);
    
    }else{
        container.innerHTML = `<div id="innerContainer">no tasks to show!</div>`
    }
}

 // Function to get color based on task priority
 function getPriorityColor(priority) {
    switch (priority) {
        case 'high': return '#e74c3c'; // Red for high priority
        case 'medium': return '#e67e22'; // Orange for medium priority
        case 'low': return '#2ecc71'; // Green for low priority
        default: return '#573b8a'; // Purple as default
    }
}