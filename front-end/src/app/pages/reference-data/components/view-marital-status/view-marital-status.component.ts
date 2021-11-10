import {Component, OnInit} from '@angular/core';
import {CommonComponent} from '../../../../app-services/CommonComponent';
import {CommonService} from '../../../../app-services/CommonService';
import {RemoteHelper} from '../../../../app-services/RemoteHelper';
import {LoaderService} from '../../../../app-services/LoaderService';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';
import {ConfirmationService} from 'primeng/api';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-view-marital-status',
    templateUrl: './view-marital-status.component.html',
    styleUrls: ['./view-marital-status.component.scss']
})
export class ViewMaritalStatusComponent extends CommonComponent implements OnInit {
    cols: any;
    records: any = [];
    private endPoint = 'refdata/maritalstatus';

    constructor(commonService: CommonService,
                helper: RemoteHelper,
                loaderService: LoaderService,
                parentRouter: Router,
                private builder: FormBuilder,
                private confirmationService: ConfirmationService,
                modalService: NgbModal) {
        super(commonService, helper, loaderService, parentRouter, modalService);
    }

    ngOnInit(): void {
        this.cols = [
            {field: 'name', header: 'Name'},
            {field: 'status', header: 'Status'}
        ];
        this.getData();
    }

    getData() {
        const controller = this;
        this.sendRequestToServer(this.endPoint,
            'get',
            null,
            true,
            function (response: any) {
                if (response.success) {
                    controller.records = response.maritalstatus;
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    updateRecord(status: boolean, rowData: any) {
        const controller = this;
        rowData.status = status;
        this.sendRequestToServer(this.endPoint + '/' + rowData.id,
            'put',
            JSON.stringify(rowData),
            true,
            function (response: any) {
                if (response.success) {
                    controller.commonService.showSuccess(response.message);
                    controller.getData();
                } else {
                    controller.commonService.showError(response.message);
                }
            }, function (error: any) {
                controller.commonService.showError(error.error.message);
            });
    }

    handleResponse(response: any) {
        return response;
    }

    createRecord() {
        this.parentRouter.navigate(['refdata/add-marital-status']);
    }

    editRecord(rowData: any) {
        this.parentRouter.navigate(['refdata/edit-marital-status', rowData.id]);
    }

    confirmAction(event: Event, status: boolean, rowData: any) {
        this.confirmationService.confirm({
            target: event.target,
            icon: 'pi pi-exclamation-triangle',
            message: 'Are you sure that you want to perform this action?',
            accept: () => {
                this.updateRecord(status, rowData);
            }
        });
    }
}
