import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { TodoWeek } from '../../interfaces/common.interfaces';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToDoWeekService {

  private TODO_WEEK_STORE = 'todo_week';

  public todoWeek$ = new BehaviorSubject<TodoWeek | null>(null);

  private _todoWeek: TodoWeek | null = null;
  get todoWeek() {
    return this._todoWeek;
  }
  set todoWeek(value: TodoWeek | null) {
    this._todoWeek = value ?? null;
    this.todoWeek$.next(this._todoWeek);

    console.log('set todo week');
  }

  constructor() {
    this.loadSaved();
  }

  public async loadSaved() {
    const { value } = await Preferences.get({ key: this.TODO_WEEK_STORE });
    this.todoWeek = (JSON.parse(value!) || []) as TodoWeek;
  }

  public async addNewTodoWeek(todo: string) {
    this.todoWeek = {
      name: todo,
      completed: 0
    }
    Preferences.set({
      key: this.TODO_WEEK_STORE,
      value: JSON.stringify(this.todoWeek)
    });
  }

  public setNewCompleted(completed: number | null) {
    if (completed) {
      this.todoWeek!.completed = completed;
      Preferences.set({
        key: this.TODO_WEEK_STORE,
        value: JSON.stringify(this.todoWeek)
      });
    }
  }

  public async deleteTodoWeek() {
    Preferences.remove({
      key: this.TODO_WEEK_STORE
    });
    this.todoWeek = null;
  }
}
