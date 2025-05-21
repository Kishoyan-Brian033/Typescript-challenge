interface IUser {
  id: number;
  name: string;
  age: number;
}

interface ITask {
  id: number;
  title: string;
  assignedTo?: number;
}

class User implements IUser {
  constructor(
    public id: number,
    public name: string,
    public age: number
  ) {}
}

class Task implements ITask {
  constructor(
    public id: number,
    public title: string,
    public assignedTo?: number
  ) {}
}

class UserService {
  private users: User[] = [];
  private lastUserId: number = 0;

  createUser(name: string, age: number): User {
    const newUser = new User(++this.lastUserId, name, age);
    this.users.push(newUser);
    return newUser;
  }getAllUsers(): User[] {
  return this.users;
}

getUserById(id: number): User | undefined {
  return this.users.find(user => user.id === id);
}

getUsersByAge(age: number): User[] {
  return this.users.filter(user => user.age === age);
}

updateUser(id: number, age: number, name: string): boolean {
  const findUser = this.users.find(user => user.id === id);
  if (findUser) {
    findUser.age = age;
    findUser.name = name;
    return true;
  }
  return false;
}

deleteUser(id: number): void {
  const userIndex = this.users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    this.users.splice(userIndex, 1);
  }
}
}

class TaskService {
  private tasks: Task[] = [];
  private lastTaskId: number = 0;
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  createTask(title: string): Task {
  const newTask = new Task(++this.lastTaskId, title);
  this.tasks.push(newTask);
  return newTask;
}

getAllTasks(): Task[] {
  return this.tasks;
}

getTaskById(id: number): Task | undefined {
  return this.tasks.find(task => task.id === id);
}

updateTask(id: number, title: string): boolean {
  const task = this.tasks.find(task => task.id === id);
  if (task) {
    task.title = title;
    return true;
  }
  return false;
}

deleteTask(id: number): void {
  const taskIndex = this.tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
    this.tasks.splice(taskIndex, 1);
  }
}

assignTask(taskId: number, userId: number): boolean {
  const task = this.tasks.find(t => t.id === taskId);
  const user = this.userService.getUserById(userId);
  
  if (task && user) {
    task.assignedTo = userId;
    return true;
  }
  return false;
}

  unassignTask(taskId: number): boolean {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return false;

    task.assignedTo = undefined;
    return true;
  }

  getTasksByUser(userId: number): Task[] {
    return this.tasks
      .filter(task => task.assignedTo === userId)
      .map(task => ({...task}));
  }
}
const userService = new UserService();
const taskService = new TaskService(userService);


const users = [
  userService.createUser("Brian", 38),
  userService.createUser("Max", 27),

];


const tasks = [
  taskService.createTask("Learn typescript"),
  taskService.createTask("DOM Assignment"),

];


taskService.assignTask(tasks[0].id, users[0].id);
taskService.assignTask(tasks[1].id, users[1].id);

console.log("All Users:", userService.getAllUsers());
console.log("All Tasks:", taskService.getAllTasks());
console.log("Brian's Tasks:", taskService.getTasksByUser(users[0].id));