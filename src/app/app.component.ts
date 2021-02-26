import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MainService } from './services/main.service';

export interface DialogData {
  name: '';
  email: '';
  phone: '';
  appointment_date: '',
  appointment_time: ''
}

export interface AppointmentElement {
  name: string;
  email: number;
  phone: number;
  slot: {slot_date: number, slot_time: String};
}

const ELEMENT_DATA: AppointmentElement[] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  minDate = new Date();
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  selectedDate;
  selectedTime;
  freeSlots: any[] = [];
  calendarDate;
  timezones;
  selectedTimezone;
  @Output()
  dateChange: EventEmitter<MatDatepickerInputEvent<any>> = new EventEmitter();
  displayedColumns = ['name', 'email', 'phone', 'slot_date', 'slot_time'];
  dataSource = ELEMENT_DATA;

  constructor(private mainService: MainService, public dialog: MatDialog) {
    this.getTimezones();
  }

  onDateChange(event): void {
    console.log(event, event.value.getTime());
    // This will return you the number of milliseconds
    // elapsed from January 1, 1970 
    this.selectedDate = event.value.getTime();
    this.dateChange.emit();
    this.getFreeSlotsForDate(this.selectedDate)
  }

  //to get free slots for the selected date
  getFreeSlotsForDate(date) {
    console.log('selected Date: ', this.selectedDate);
    
    let data = {
      selectedDate: date
    }
    this.mainService.getFreeSLots(data).subscribe(res => {
      console.log('result from free slots: ', res);
      this.freeSlots = res['data'];
    })
  }

  //book slot for the selected date and time
  bookSlot(slot) {
    this.selectedTime = slot;
    console.log('data selected for current slot: ', slot, this.selectedDate);
    this.openDialog();
  }

  //to get all appointments
  getBookedAppointments() {
    this.mainService.getAppointments('').subscribe(res => {
      this.dataSource = res['data'];
      console.log('result from appointments: ', res, this.dataSource);
    })
  }

  //to get all timezones
  getTimezones() {
    this.mainService.getTimezones('').subscribe(res => {
      this.timezones = res['data'];
      this.selectedTimezone = " (GMT+05:30) Asia/Kolkata";
      console.log('result from timezones: ', res, this.timezones);
    })
  }

  //form to fill information of client
  openDialog() {
    this.dialog.open(DialogDataExampleDialog, {
      // height: '400px',
      width: '600px',
      data: {
        name: '',
        email: '',
        phone: '',
        appointment_date: this.selectedDate,
        appointment_time: this.selectedTime
      }
    });
    this.dialog.afterAllClosed.subscribe(
      () => (this.getFreeSlotsForDate(this.selectedDate))
    );
  }

  tabClick(event) {
    console.log('tab called: ', event);
    if (event.index == 1)
      this.getBookedAppointments();
  }
}

@Component({
  selector: 'client-dialog',
  templateUrl: 'client-dialog.html',
  styleUrls: ['./app.component.css']
})
export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private _formBuilder: FormBuilder, private mainService: MainService, private _snackBar: MatSnackBar, private appComponent: AppComponent) {}
  clientForm: FormGroup;

  ngOnInit() {
    this.clientForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      appointment_date: [new Date(this.data.appointment_date).toDateString(), Validators.required],
      appointment_time: [this.data.appointment_time, Validators.required],
    });
  }

  confirm() {
    let data = {
      name: this.clientForm.value.name,
      email: this.clientForm.value.email,
      phone: this.clientForm.value.phone,
      slot_date: this.data.appointment_date,
      slot_time: this.clientForm.value.appointment_time
    }
    console.log('appointment date: ', data);
    this.mainService.bookSelectedSlot(data).subscribe(res => {
      console.log('result: ', res);
      this._snackBar.open('Appointment Booked Successfully!', '', {
        duration: 2000,
      });
      this.appComponent.dialog.closeAll();
      // this.appComponent.getFreeSlotsForDate(this.data.appointment_date);
    })
  }
}
