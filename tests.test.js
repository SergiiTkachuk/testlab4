const fs = require('fs');
const TaskManager = require('./taskManager.js');

describe('TaskManager', () => {
  let taskManager;

  beforeEach(() => {
    // Перед кожним тестом створюємо новий екземпляр TaskManager
    taskManager = new TaskManager('test.json');
  });

  afterEach(() => {
    // Після кожного тесту очищаємо дані
    fs.writeFileSync('test.json', '[]');
  });

  describe('loadTasks', () => {
    test('should load tasks from test.json file', () => {
      // Записуємо масив задач у файл test.json
      const tasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          deadline: '2023-05-20',
          completed: false,
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Description 2',
          deadline: '2023-05-15',
          completed: true,
        },
      ];
      fs.writeFileSync('test.json', JSON.stringify(tasks));

      // Завантажуємо задачі з файлу
      const loadedTasks = taskManager.loadTasks();

      // Перевіряємо, що завантажені задачі співпадають з вмістом файлу
      expect(loadedTasks).toEqual(tasks);
    });

    test('should return an empty array if test.json file does not exist', () => {
      // Видаляємо файл test.json, якщо він існує
      if (fs.existsSync('test.json')) {
        fs.unlinkSync('test.json');
      }

      // Завантажуємо задачі з неіснуючого файлу
      const loadedTasks = taskManager.loadTasks();

      // Перевіряємо, що повернутий масив задач є пустим
      expect(loadedTasks).toEqual([]);
    });

    test('should return an empty array if an error occurs while reading test.json file', () => {
      // Симулюємо помилку під час читання файлу
      jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
        throw new Error('Mocked readFileSync error');
      });

      // Завантажуємо задачі з файлу
      const loadedTasks = taskManager.loadTasks();

      // Перевіряємо, що повернутий масив задач є пустим
      expect(loadedTasks).toEqual([]);

      // Відновлюємо оригінальну реалізацію fs.readFileSync
      fs.readFileSync.mockRestore();
    });
  });

  describe('saveTasks', () => {
    test('should save tasks to test.json file', () => {
      // Додаємо задачу до TaskManager
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Зберігаємо задачі у файл
      taskManager.saveTasks();

      // Зчитуємо вміст файлу test.json
      const fileContent = fs.readFileSync('test.json', 'utf-8');

      // Перевіряємо, що вміст файлу відповідає задачам TaskManager
      expect(JSON.parse(fileContent)).toEqual(taskManager.tasks);
    });
  });

  describe('addTask', () => {
    test('should add a new task to the tasks list', () => {
      // Додаємо нову задачу
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Перевіряємо, що задача була додана до списку задач
      expect(taskManager.tasks.length).toBe(1);
      expect(taskManager.tasks[0].title).toBe('Task 1');
      expect(taskManager.tasks[0].description).toBe('Description 1');
      expect(taskManager.tasks[0].deadline).toBe('2023-05-20');
      expect(taskManager.tasks[0].completed).toBe(false);
    });

    it('should generate a unique ID for each task', () => {
      // Додаємо дві задачі
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');
      taskManager.addTask('Task 2', 'Description 2', '2023-05-15');

      // Перевіряємо, що ID обох задач є унікальними
      expect(taskManager.tasks[0].id).not.toBe(taskManager.tasks[1].id);
    });
  });

  describe('editTask', () => {
    test('should edit the specified task', () => {
      // Додаємо задачу для редагування
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Редагуємо задачу
      taskManager.editTask(taskManager.tasks[0].id, 'New Title', 'New Description', '2023-05-25');

      // Перевіряємо, що задача була редагована
      expect(taskManager.tasks[0].title).toBe('New Title');
      expect(taskManager.tasks[0].description).toBe('New Description');
      expect(taskManager.tasks[0].deadline).toBe('2023-05-25');
    });

    test('should not modify the task if no new values are provided', () => {
      // Додаємо задачу для редагування
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Редагуємо задачу без нових значень
      taskManager.editTask(taskManager.tasks[0].id);

      // Перевіряємо, що задача не була змінена
      expect(taskManager.tasks[0].title).toBe('Task 1');
      expect(taskManager.tasks[0].description).toBe('Description 1');
      expect(taskManager.tasks[0].deadline).toBe('2023-05-20');
    });

    test('should display a message if the task is not found', () => {
      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);
    
      // Редагуємо неіснуючу задачу
      taskManager.editTask('nonexistentId', 'New Title', 'New Description', '2023-05-25');
    
      // Перевіряємо, що функція-заглушка була викликана з очікуваними аргументами
      expect(consoleLogMock).toHaveBeenCalledWith('Task not found.');
    
      console.log.mockRestore();
    });
    
  });

  describe('completeTask', () => {
    it('should mark the specified task as completed', () => {
      // Додаємо задачу для позначення як виконану
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Позначаємо задачу як виконану
      taskManager.completeTask(taskManager.tasks[0].id);

      // Перевіряємо, що задача була позначена як виконана
      expect(taskManager.tasks[0].completed).toBe(true);
      expect(taskManager.tasks[0].completionDate).toBeDefined();
    });

    it('should display a message if the task is not found', () => {
      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);
      // Позначаємо неіснуючу задачу як виконану
      taskManager.completeTask('nonexistentId');

      // Перевіряємо, що виведено повідомлення про незнайдену задачу
      expect(consoleLogMock).toHaveBeenCalledWith('Task not found.');
      console.log.mockRestore();
    });
  });

  describe('deleteTask', () => {
    it('should delete the specified task', () => {
      // Додаємо задачу для видалення
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Видаляємо задачу
      taskManager.deleteTask(taskManager.tasks[0].id);

      // Перевіряємо, що задача була видалена
      expect(taskManager.tasks.length).toBe(0);
    });

    it('should display a message if the task is not found', () => {
      const consoleLogMock = jest.fn();
      jest.spyOn(console, 'log').mockImplementation(consoleLogMock);
      // Видаляємо неіснуючу задачу
      taskManager.deleteTask('nonexistentId');

      // Перевіряємо, що виведено повідомлення про незнайдену задачу
      expect(consoleLogMock).toHaveBeenCalledWith('Task not found.');
      console.log.mockRestore();
    });
  });

  describe('findTaskById', () => {
    it('should return the task with the specified ID', () => {
      // Додаємо задачу для пошуку
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');

      // Знаходимо задачу за ID
      const foundTask = taskManager.findTaskById(taskManager.tasks[0].id);

      // Перевіряємо, що знайдена задача співпадає з доданою задачею
      expect(foundTask).toEqual(taskManager.tasks[0]);
    });

    it('should return undefined if the task with the specified ID is not found', () => {
      // Знаходимо неіснуючу задачу за ID
      const foundTask = taskManager.findTaskById('nonexistentId');

      // Перевіряємо, що повернуто undefined
      expect(foundTask).toBeUndefined();
    });
  });

  describe('showExpiredTasks', () => {
    it('should display a list of expired tasks', () => {
      // Додаємо кілька задач з минулими термінами
      taskManager.addTask('Task 1', 'Description 1', '2023-05-01');
      taskManager.addTask('Task 2', 'Description 2', '2023-04-30');

      // Встановлюємо spy на console.log
      jest.spyOn(console, 'log');

      // Викликаємо метод showExpiredTasks
      taskManager.showExpiredTasks();

      // Перевіряємо, що виведено правильний список прострочених задач
      expect(console.log).toHaveBeenCalledWith('Expired tasks:');
      expect(console.log).toHaveBeenCalledWith('- Task 1');
      expect(console.log).toHaveBeenCalledWith('  Description: Description 1');
      expect(console.log).toHaveBeenCalledWith('  Deadline: 2023-05-01');
      expect(console.log).toHaveBeenCalledWith('----------------------------');
      expect(console.log).toHaveBeenCalledWith('- Task 2');
      expect(console.log).toHaveBeenCalledWith('  Description: Description 2');
      expect(console.log).toHaveBeenCalledWith('  Deadline: 2023-04-30');
      expect(console.log).toHaveBeenCalledWith('----------------------------');

      // Відновлюємо оригінальну реалізацію console.log
      console.log.mockRestore();
    });

    it('should not display any tasks if no tasks are expired', () => {
      // Додаємо задачі з майбутніми термінами
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');
      taskManager.addTask('Task 2', 'Description 2', '2023-06-01');

      // Встановлюємо spy на console.log
      jest.spyOn(console, 'log');

      // Викликаємо метод showExpiredTasks
      taskManager.showExpiredTasks();

      // Перевіряємо, що не виведено жодної простроченої задачі
      expect(console.log).not.toHaveBeenCalledWith('Expired tasks:');

      // Відновлюємо оригінальну реалізацію console.log
      console.log.mockRestore();
    });
  });

  describe('showPendingTasks', () => {
    it('should display a sorted list of pending tasks by deadline', () => {
      // Додаємо кілька задач з різними термінами
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');
      taskManager.addTask('Task 2', 'Description 2', '2023-04-30');
      taskManager.addTask('Task 3', 'Description 3', '2023-05-10');

      // Встановлюємо spy на console.log
      jest.spyOn(console, 'log');

      // Викликаємо метод showPendingTasks
      taskManager.showPendingTasks();

      // Перевіряємо, що виведено правильно відсортований список невиконаних задач
      expect(console.log).toHaveBeenCalledWith('Pending tasks (sorted by deadline):');
      expect(console.log).toHaveBeenCalledWith('- Task 2');
      expect(console.log).toHaveBeenCalledWith('  Description: Description 2');
      expect(console.log).toHaveBeenCalledWith('  Deadline: 2023-04-30');
      expect(console.log).toHaveBeenCalledWith('----------------------------');
      expect(console.log).toHaveBeenCalledWith('- Task 3');
      expect(console.log).toHaveBeenCalledWith('  Description: Description 3');
      expect(console.log).toHaveBeenCalledWith('  Deadline: 2023-05-10');
      expect(console.log).toHaveBeenCalledWith('----------------------------');
      expect(console.log).toHaveBeenCalledWith('- Task 1');
      expect(console.log).toHaveBeenCalledWith('  Description: Description 1');
      expect(console.log).toHaveBeenCalledWith('  Deadline: 2023-05-20');
      expect(console.log).toHaveBeenCalledWith('----------------------------');

      // Відновлюємо оригінальну реалізацію console.log
      console.log.mockRestore();
    });

    it('should display a message if there are no pending tasks', () => {
      // Додаємо виконану задачу
      taskManager.addTask('Task 1', 'Description 1', '2023-05-20');
      taskManager.completeTask(taskManager.tasks[0].id);

      // Встановлюємо spy на console.log
      jest.spyOn(console, 'log');

      // Викликаємо метод showPendingTasks
      taskManager.showPendingTasks();

      // Перевіряємо, що виведено повідомлення про відсутність невиконаних задач
      expect(console.log).toHaveBeenCalledWith('Pending tasks (sorted by deadline):');
      expect(console.log).toHaveBeenCalledWith('No pending tasks.');

      // Відновлюємо оригінальну реалізацію console.log
      console.log.mockRestore();
    });
  });
});
