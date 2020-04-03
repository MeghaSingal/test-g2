import { Component, HostBinding, Input, ElementRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { SeriesQuery } from '../state/series.query';
import { SeriesService } from '../state/series.service';
import { UploadFile, NzMessageService, UploadXHRArgs } from 'ng-zorro-antd';
import { Observable, Observer } from 'rxjs';
import { HttpRequest, HttpEvent, HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';
import { FavoritesService } from '../../favorites/state/favorites.service';
@Component({
    selector: 'series-upload',
    templateUrl: './series-upload.component.html'
})
export class SeriesUploadComponent {
    constructor(private seriesService: SeriesService,
        private seriesQuery: SeriesQuery,
        private fileSaverService: FileSaverService,
        private msg: NzMessageService,
        private http: HttpClient,
        private favoritesService: FavoritesService) { }
    uploadedSeriesControl = new FormControl();
    download() {
        const fileName = "series.txt";
        const fileType = this.fileSaverService.genType(fileName);
        const txtBlog = new Blob([this.uploadedSeriesControl.value], { type: fileType });
        this.fileSaverService.save(txtBlog, fileName);
    }

    search() {
        this.seriesService.updateUploadedNames(this.uploadedSeriesControl.value);
    }

    hanldeUploadChange(info: { file: UploadFile }): void {
        switch (info.file.status) {
            case 'uploading':
                this.uploading = true;
                break;
            case 'done':
                this.uploading = false;
                if (info.file.thumbUrl) {
                    this.uploadedSeriesControl.patchValue(atob(info.file.thumbUrl.split(',')[1]));
                }
                break;
            case 'error':
                this.msg.error('Network error, upload unsuccessful!');
                this.uploading = false;
                break;
        }

    }

    uploading: boolean = false;
    beforeUpload = (file: UploadFile) => {
        console.log(file);
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            console.log(fileReader.result);
        }
        // fileReader.readAsText(file);

        return new Observable((observer: Observer<boolean>) => {
            const isTXT = file.type === 'text/plain';
            if (!isTXT) {
                this.msg.error('You can only upload text file!');
                observer.complete();
                return;
            }
        });
    };

    customReq = (item: UploadXHRArgs) => {
        // Create a FormData here to store files and other parameters.
        const formData = new FormData();
        formData.append('file', item.file as any);
        formData.append('id', '1000');
        const req = new HttpRequest('POST', item.action!, formData, {
            reportProgress: true,
            withCredentials: true
        });

        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.uploadedSeriesControl.patchValue(fileReader.result);
        }
        fileReader.readAsText(item.file as any);

        // this.uploading = true;
        // Always returns a `Subscription` object. nz-upload would automatically unsubscribe it at correct time.
        // return this.http.request(req).subscribe(
        //     // tslint:disable-next-line no-any
        //     (event: HttpEvent<any>) => {
        //         if (event.type === HttpEventType.UploadProgress) {
        //             if (event.total! > 0) {
        //                 // tslint:disable-next-line:no-any
        //                 (event as any).percent = (event.loaded / event.total!) * 100;
        //             }
        //             item.onProgress!(event, item.file!);
        //         } else if (event instanceof HttpResponse) {
        //             this.uploading = false;
        //             item.onSuccess!(event.body, item.file!, event);
        //         }
        //     },
        //     err => {
        //         this.uploading = false;
        //         item.onError!(err, item.file!);
        //     }
        // );
    }

    confirmAddToFavorites = false;
    listName: string = "";
    addToFavorites() {
        this.confirmAddToFavorites = true;
    }
    addToFavoritesOK() {
        if (this.seriesQuery.uploadedNames) {
            this.confirmAddToFavorites = false;
            this.favoritesService.add({ name: this.listName, seriesNames: this.seriesQuery.uploadedNames });
            this.msg.create('success', 'Your list of series has been saved successfully.');
        } else {
            this.confirmAddToFavorites = false;
            this.msg.create('error', 'Please search for some series first.');
        }
    }
    addToFavoritesCancel() {
        this.confirmAddToFavorites = false;
    }

}