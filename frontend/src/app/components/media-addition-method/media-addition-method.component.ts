import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-media-addition-method',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './media-addition-method.component.html',
  styleUrl: './media-addition-method.component.css'
})
export class MediaAdditionMethodComponent {
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;
  @Output() closeModal = new EventEmitter<void>();
  faXmark = faXmark;

  constructor(private router: Router) {}

  navigateToSingleMedia() {
    this.router.navigate(['/single_media_addition']);
  }

  uploadFile() {
    this.fileInput.nativeElement.click();
  }

  handleFileInput(event: Event) {
    const element = event.target as HTMLInputElement;
    const files = element.files;
    if (files && files.length > 0) {
      // Handle the file processing here
      alert(`File uploaded: ${files[0].name}`);
    }
  }

  closeOnClickOutside(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }
}
