import { Component, Inject, Output, ViewChild } from '@angular/core'
import { ImageCropperComponent } from "../../image-cropper/component/image-cropper.component"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"
import { ImageCroppedEvent } from "../../image-cropper/interfaces"
import { CropComponent } from "../crop/crop.component"
import { BeehiveAPI } from '@env'
import { authFormData } from 'src/app/services/auth/auth'
import { EventEmitter } from '@angular/core'

@Component({
    selector: 'app-image-manager',
    templateUrl: './image-manager.component.html',
    styleUrls: ['./image-manager.component.css']
})
export class ImageManagerComponent {
    title!: string
    path!: string
    aspectRatio!: number
    type!: string

    originalFile: any = ''
    imageChangedEvent: any = ''
    croppedImage: any = ''
    showCropper = false
    cropped = false

    filename!: string
    filetype!: string
    imageToUpload: File | null = null

    @ViewChild(ImageCropperComponent) imageCropper!: ImageCropperComponent
    @Output() uploadStatusBannerEmitter = new EventEmitter<string>();
    @Output() uploadStatusSmallEmitter = new EventEmitter<string>();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<CropComponent>,
        ){
            if (data) {
                this.title = data.title
                this.path = data.path
                this.aspectRatio = data.aspectRatio
            }
        }

    fileChangeEvent(event: any): void {
        // Store the original file when a new file is selected
        this.originalFile = event?.target?.files[0] || null

        if(this.originalFile) {
            this.imageChangedEvent = event

            this.filename = this.originalFile.name
            this.filetype = this.originalFile.type
        }
    }

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64

        // Create a new File object from the cropped image base64 data
        if (event.base64) {
            const blob = this.base64toBlob(event.base64);
            this.imageToUpload = new File([blob], this.filename, { type: this.filetype });
        } else {
            console.error('Base64 data is missing or invalid.')
        }
    }

    imageLoaded() {
        this.showCropper = true;
    }

    rotateLeft() {
        this.imageCropper.rotateLeft()
    }

    rotateRight() {
        this.imageCropper.rotateRight()
    }

    flipHorizontal() {
        this.imageCropper.flipHorizontal()
    }

    flipVertical() {
        this.imageCropper.flipVertical()
    }

    onUpload() {
        if (this.imageToUpload) {
            let form = new FormData()
            form.append('file', this.imageToUpload)
            fetch(BeehiveAPI.BASE_URL + BeehiveAPI.IMAGES_PATH + this.path, {
                headers: authFormData(),
                method: 'POST',
                body: form
            }).then(res => {
                if (res.ok) {
                    this.onClose('success')
                } else {
                    res.json().then((data) => {
                        console.error(`Image upload failed: ${'error' in data ? data.error : JSON.stringify(data)}`)
                        this.onClose(`Image upload failed: ${'error' in data ? data.error : JSON.stringify(data)}`)
                    })
                }
            }).catch(err => {
                console.error(`Error occurred during image upload: ${err}`)
                this.onClose(`Error occurred during image upload: ${err}`)
            })
        }
    }

    base64toBlob(base64Data: string) {
        const byteString = atob(base64Data.split(',')[1])
        const arrayBuffer = new ArrayBuffer(byteString.length)
        const uint8Array = new Uint8Array(arrayBuffer)

        for (let i = 0; i < byteString.length; i++) {
            uint8Array[i] = byteString.charCodeAt(i)
        }

        return new Blob([arrayBuffer], { type: 'image/png' })
    }

    onClose(res: string): void {
        this.dialogRef.close(res);
    }

    cropperConfirm(): void {
        this.cropped = true;
    }

    reset() {
        this.cropped = false;

        setTimeout(() => {
        // Clear existing cropped image
        this.croppedImage = ''

        // Resets the ImageCropperComponent
        this.imageChangedEvent = null
        this.imageCropper.imageBase64 = ''
        this.imageCropper.imageFileChanged = this.originalFile
        this.showCropper = false
        }, 1)
    }

    isInvalid() {
        return !this.cropped
    }
}
