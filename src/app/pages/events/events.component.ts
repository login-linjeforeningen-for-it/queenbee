import { Component } from '@angular/core';

@Component({
    selector: 'app-events',
    templateUrl: './events.component.html'
})
export class EventsComponent {
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'auto',
        });
    }
}
