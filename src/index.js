var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var User = /** @class */ (function () {
    function User(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
    return User;
}());
var Task = /** @class */ (function () {
    function Task(id, title, assignedTo) {
        this.id = id;
        this.title = title;
        this.assignedTo = assignedTo;
    }
    return Task;
}());
var UserService = /** @class */ (function () {
    function UserService() {
        this.users = [];
        this.lastUserId = 0;
    }
    UserService.prototype.createUser = function (name, age) {
        var newUser = new User(++this.lastUserId, name, age);
        this.users.push(newUser);
        return newUser;
    };
    UserService.prototype.getAllUsers = function () {
        return this.users;
    };
    UserService.prototype.getUserById = function (id) {
        return this.users.find(function (user) { return user.id === id; });
    };
    UserService.prototype.getUsersByAge = function (age) {
        return this.users.filter(function (user) { return user.age === age; });
    };
    UserService.prototype.updateUser = function (id, age, name) {
        var findUser = this.users.find(function (user) { return user.id === id; });
        if (findUser) {
            findUser.age = age;
            findUser.name = name;
            return true;
        }
        return false;
    };
    UserService.prototype.deleteUser = function (id) {
        var userIndex = this.users.findIndex(function (user) { return user.id === id; });
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
        }
    };
    return UserService;
}());
var TaskService = /** @class */ (function () {
    function TaskService(userService) {
        this.tasks = [];
        this.lastTaskId = 0;
        this.userService = userService;
    }
    TaskService.prototype.createTask = function (title) {
        var newTask = new Task(++this.lastTaskId, title);
        this.tasks.push(newTask);
        return newTask;
    };
    TaskService.prototype.getAllTasks = function () {
        return this.tasks;
    };
    TaskService.prototype.getTaskById = function (id) {
        return this.tasks.find(function (task) { return task.id === id; });
    };
    TaskService.prototype.updateTask = function (id, title) {
        var task = this.tasks.find(function (task) { return task.id === id; });
        if (task) {
            task.title = title;
            return true;
        }
        return false;
    };
    TaskService.prototype.deleteTask = function (id) {
        var taskIndex = this.tasks.findIndex(function (task) { return task.id === id; });
        if (taskIndex !== -1) {
            this.tasks.splice(taskIndex, 1);
        }
    };
    TaskService.prototype.assignTask = function (taskId, userId) {
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        var user = this.userService.getUserById(userId);
        if (task && user) {
            task.assignedTo = userId;
            return true;
        }
        return false;
    };
    TaskService.prototype.unassignTask = function (taskId) {
        var task = this.tasks.find(function (t) { return t.id === taskId; });
        if (!task)
            return false;
        task.assignedTo = undefined;
        return true;
    };
    TaskService.prototype.getTasksByUser = function (userId) {
        return this.tasks
            .filter(function (task) { return task.assignedTo === userId; })
            .map(function (task) { return (__assign({}, task)); });
    };
    return TaskService;
}());
var userService = new UserService();
var taskService = new TaskService(userService);
// const users = [
//   userService.createUser("Brian", 23),
//   userService.createUser("Max", 23),
// ];
// const tasks = [
//   taskService.createTask("Learn typescript"),
//   taskService.createTask("DOM Assignment"),
// ];
// taskService.assignTask(tasks[0].id, users[0].id);
// taskService.assignTask(tasks[1].id, users[1].id);
// console.log("All Users:", userService.getAllUsers());
// console.log("All Tasks:", taskService.getAllTasks());
// console.log("Brian's Tasks:", taskService.getTasksByUser(users[0].id));
var TaskManagerApp = /** @class */ (function () {
    function TaskManagerApp() {
        this.userService = new UserService();
        this.taskService = new TaskService(this.userService);
        this.initializeEventListeners();
        this.renderUsers();
        this.renderTasks();
    }
    TaskManagerApp.prototype.initializeEventListeners = function () {
        var _this = this;
        var _a, _b, _c;
        // User form submission
        (_a = document.getElementById('user-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
            var nameInput = document.getElementById('username');
            var emailInput = document.getElementById('user-email');
            if (nameInput.value) {
                _this.userService.createUser(nameInput.value, 0); // Age 0 as placeholder
                nameInput.value = '';
                emailInput.value = '';
                _this.renderUsers();
            }
        });
        // Task form submission
        (_b = document.getElementById('add-task')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
            var titleInput = document.getElementById('task-title');
            var descInput = document.getElementById('description');
            if (titleInput.value) {
                _this.taskService.createTask(titleInput.value, descInput.value);
                titleInput.value = '';
                descInput.value = '';
                _this.renderTasks();
            }
        });
        // Task assignment
        (_c = document.getElementById('assignTaskBtn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', function () {
            var taskIdInput = document.getElementById('assign-task');
            var userId = parseInt(taskIdInput.value);
            if (userId && _this.taskService.getAllTasks().length > 0) {
                _this.taskService.assignTask(_this.taskService.getAllTasks()[0].id, userId);
                taskIdInput.value = '';
                _this.renderTasks();
            }
        });
    };
    TaskManagerApp.prototype.renderUsers = function () {
        var _this = this;
        var userList = document.querySelector('.user-list');
        if (!userList)
            return;
        userList.innerHTML = '';
        this.userService.getAllUsers().forEach(function (user) {
            var _a;
            var userElement = document.createElement('div');
            userElement.className = 'user-item';
            userElement.dataset.userId = user.id.toString();
            userElement.innerHTML = "\n        <span class=\"user-name\">".concat(user.name, "</span>\n        <span class=\"user-email\">").concat(user.id, "@example.com</span>\n        <div class=\"user-actions\">\n          <button class=\"update-btn\">Update</button>\n          <button class=\"delete-btn\">Delete</button>\n        </div>\n      ");
            userList.appendChild(userElement);
            // Add event listeners for the action buttons
            (_a = userElement.querySelector('.delete-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                _this.userService.deleteUser(user.id);
                _this.renderUsers();
            });
        });
    };
    TaskManagerApp.prototype.renderTasks = function () {
        var _this = this;
        var tasksList = document.getElementById('tasksList');
        if (!tasksList)
            return;
        tasksList.innerHTML = '';
        this.taskService.getAllTasks().forEach(function (task) {
            var _a;
            var taskElement = document.createElement('div');
            taskElement.className = 'task-item';
            taskElement.dataset.taskId = task.id.toString();
            taskElement.innerHTML = "\n        <span class=\"task-title\">".concat(task.title, "</span>\n        <span class=\"task-desc\">").concat(task.description || 'No description', "</span>\n        <span class=\"task-assigned\">").concat(task.assignedTo ? "Assigned to: ".concat(task.assignedTo) : 'Unassigned', "</span>\n        <div class=\"task-actions\">\n          <button class=\"update-task-btn\">Update</button>\n          <button class=\"delete-task-btn\">Delete</button>\n        </div>\n      ");
            tasksList.appendChild(taskElement);
            // Add event listeners for the action buttons
            (_a = taskElement.querySelector('.delete-task-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
                _this.taskService.deleteTask(task.id);
                _this.renderTasks();
            });
        });
    };
    return TaskManagerApp;
}());
// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new TaskManagerApp();
});
