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
  constructor(public id: number, public name: string, public age: number) {}
}

class Task implements ITask {
  constructor(public id: number, public title: string, public assignedTo?: number) {}
}

class UserManager {
  private users: User[] = [];
  private lastUserId: number = 0;

  createUser(name: string, age: number): User {
    const newUser = new User(++this.lastUserId, name, age);
    this.users.push(newUser);
    return newUser;
  }
   getAllUsers(): User[] {
    return [...this.users]; 
  }
}

class TaskService {
  private tasks: Task[] = [];
  private lastTaskId: number = 0;
  private UserManager: UserManager;

  constructor(UserManager: UserManager) {
    this.UserManager = UserManager;
  }
}
