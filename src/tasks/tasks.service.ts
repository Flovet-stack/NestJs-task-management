import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks: Task[] = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (
          task.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          task.description
            .toLocaleLowerCase()
            .includes(search.toLocaleLowerCase())
        ) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const task: Task = this.tasks.filter((task) => task.id === id)[0];
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task: Task = this.getTaskById(id);
    const indexToUpdate = this.tasks.indexOf(task);
    task.status = status;
    this.tasks[indexToUpdate] = task;
    return task;
  }

  deleteTask(id: string): Task[] {
    const newTasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = newTasks;
    return this.tasks;
  }
}
