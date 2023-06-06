const fs = require('fs');

class TaskManager {
  constructor() {
    this.tasks = this.loadTasks();
  }

  loadTasks() {
    try {
      const data = fs.readFileSync('tasks.json');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveTasks() {
    const jsonData = JSON.stringify(this.tasks, null, 2);
    fs.writeFileSync('tasks.json', jsonData);
  }
  

  listTasks() {
    console.log('All tasks:');
    this.tasks.forEach((task) => {
      console.log(`- ${task.title} [${task.completed ? 'Completed' : 'Pending'}]`);
      console.log(`  Description: ${task.description}`);
      console.log(`  Deadline: ${task.deadline || 'No deadline'}`);
      console.log(`  Completion Date: ${task.completionDate || 'Not completed'}`);
      console.log('----------------------------');
    });
  }

  addTask(title, description, deadline) {
    const task = {
      id: Date.now().toString(),
      title,
      description,
      deadline,
      completed: false,
    };
    this.tasks.push(task);
    this.saveTasks();
    console.log('Task added successfully.');
  }

  editTask(taskId, title, description, deadline) {
    const task = this.findTaskById(taskId);
    if (task) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.deadline = deadline || task.deadline;
      this.saveTasks();
      console.log('Task edited successfully.');
    } else {
      console.log('Task not found.');
    }
  }

  completeTask(taskId) {
    const task = this.findTaskById(taskId);
    if (task) {
      task.completed = true;
      task.completionDate = new Date().toLocaleString();
      this.saveTasks();
      console.log('Task marked as completed.');
    } else {
      console.log('Task not found.');
    }
  }

  deleteTask(taskId) {
    const index = this.tasks.findIndex((task) => task.id === taskId);
    if (index !== -1) {
      this.tasks.splice(index, 1);
      this.saveTasks();
      console.log('Task deleted successfully.');
    } else {
      console.log('Task not found.');
    }
  }

  findTaskById(taskId) {
    return this.tasks.find((task) => task.id === taskId);
  }

  showExpiredTasks() {
   const currentDate = new Date();
   const expiredTasks = this.tasks.filter((task) => !task.completed && task.deadline && new Date(task.deadline) < currentDate);
   
   console.log('Expired tasks:');
   expiredTasks.forEach((task) => {
     console.log(`- ${task.title}`);
     console.log(`  Description: ${task.description}`);
     console.log(`  Deadline: ${task.deadline}`);
     console.log('----------------------------');
   });
 }

 showPendingTasks() {
   const pendingTasks = this.tasks.filter((task) => !task.completed);
   pendingTasks.sort((a, b) => {
     if (!a.deadline) return -1;
     if (!b.deadline) return 1;
     return new Date(a.deadline) - new Date(b.deadline);
   });

   console.log('Pending tasks (sorted by deadline):');
   pendingTasks.forEach((task) => {
     console.log(`- ${task.title}`);
     console.log(`  Description: ${task.description}`);
     console.log(`  Deadline: ${task.deadline}`);
     console.log('----------------------------');
   });
 }
}

module.exports = TaskManager;
