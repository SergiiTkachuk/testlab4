const { program } = require('commander');
const TaskManager = require('./taskManager');

const taskManager = new TaskManager();

program.version('1.0.0').description('Task Tracker');

program
  .command('list')
  .description('Show all tasks')
  .action(() => {
    taskManager.listTasks();
  });

program
  .command('add <title> [description] [deadline]')
  .description('Add a new task')
  .action((title, description, deadline) => {
    taskManager.addTask(title, description, deadline);
  });

program
  .command('edit <taskId> [title] [description] [deadline]')
  .description('Edit a task')
  .action((taskId, title, description, deadline) => {
    taskManager.editTask(taskId, title, description, deadline);
  });

program
  .command('complete <taskId>')
  .description('Mark a task as completed')
  .action((taskId) => {
    taskManager.completeTask(taskId);
  });

program
  .command('delete <taskId>')
  .description('Delete a task')
  .action((taskId) => {
    taskManager.deleteTask(taskId);
  });

program
  .command('expired')
  .description('Show expired tasks')
  .action(() => {
    taskManager.showExpiredTasks();
  });

  program
  .command('pending')
  .description('Show pending tasks sorted by deadline')
  .action(() => {
    taskManager.showPendingTasks();
  });

program.parse(process.argv);
