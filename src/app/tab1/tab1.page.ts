import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToDoWeekService } from '../services/to-do-week/to-do-week.service';
import { TodoWeek } from '../interfaces/common.interfaces';
import { Subject, takeUntil } from 'rxjs';



@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  @ViewChildren(IonModal) modals!: QueryList<IonModal>;

  toDoWeek: TodoWeek = {
    name: '',
    completed: 0
  };
  
  name!: string;

  todoWeekCompleted!: number;

  private destroySubject = new Subject<void>();

  constructor(private toDoWeekService: ToDoWeekService) {}

  ngOnInit(): void {
    this.toDoWeekService.todoWeek$.pipe(takeUntil(this.destroySubject)).subscribe(val => {
      console.log(val);
      
      if (val) {
        this.toDoWeek = val;

        this.name = val.name;
        this.todoWeekCompleted = val.completed;
      }
    });
  }

  ngOnDestroy(): void {
      this.destroySubject.next();
  }

  cancel() {
    this.modals.toArray()[0].dismiss(null, 'cancel');
  }

  confirmTodoWeek() {
    this.modals.toArray()[0].dismiss(this.name, 'confirm');
  }
  
  cancelCompleted() {
    this.modals.toArray()[1].dismiss(null, 'cancel');
  }
  
  confirmTodoWeekCompleted() {
    this.modals.toArray()[1].dismiss(this.todoWeekCompleted, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.toDoWeekService.addNewTodoWeek(ev.detail.data ?? '');
    }
  }
  
  onWillDismissCompleted(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<number>>;
    if (ev.detail.role === 'confirm') {
      this.toDoWeekService.setNewCompleted(ev.detail.data ?? null);
    }
  }
}
