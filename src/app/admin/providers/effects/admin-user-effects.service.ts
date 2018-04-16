import { Injectable } from '@angular/core';

import { ApiService } from '../../../core/providers/api/api.service';
import { I18nNotification } from '../../../core/providers/i18n-notification/i18n-notification.service';
import { ApplicationStateService } from '../../../state/providers/application-state.service';
import { UserCreateRequest, UserResponse, UserUpdateRequest } from '../../../common/models/server-models';
import { User } from '../../../common/models/user.model';


@Injectable()
export class AdminUserEffectsService {

    constructor(private api: ApiService,
                private notification: I18nNotification,
                private state: ApplicationStateService) {
    }

    loadUsers(page: number, perPage: number): void {
        this.state.actions.adminUsers.fetchUsersStart();

        this.api.user.getUsers({ page, perPage })
            .subscribe(
                response => {
                    this.state.actions.adminUsers.fetchUsersSuccess(response);
                },
                error => {
                    this.state.actions.adminUsers.fetchUsersError();
                }
            );
    }

    newUser(): void {
        this.state.actions.adminUsers.newUser();
    }

    openUser(uuid: string): Promise<User | void> {
        this.state.actions.adminUsers.openUserStart();

        return this.api.user.getUser({ userUuid: uuid})
            .toPromise()
            .then(
                response => {
                    this.state.actions.adminUsers.openUserSuccess(response);
                    return response;
                },
                error => {
                    this.state.actions.adminUsers.openUserError();
                }
            );
    }

    createUser(userRequest: UserCreateRequest): Promise<UserResponse> {
        this.state.actions.adminUsers.createUserStart();
        return this.api.admin.createUser({}, userRequest)
            .do(
                user => {
                    this.state.actions.adminUsers.createUserSuccess(user);
                    this.notification.show({
                        type: 'success',
                        message: 'admin.user_created'
                    });
                },
                () => this.state.actions.adminUsers.createUserError()
            )
            .toPromise();
    }

    updateUser(userUuid: string, user: UserUpdateRequest): Promise<User | void> {
        this.state.actions.adminUsers.updateUserStart();

        return this.api.admin.updateUser({ userUuid }, user)
            .toPromise()
            .then(
                response => {
                    this.state.actions.adminUsers.updateUserSuccess(response);
                    this.notification.show({
                        type: 'success',
                        message: 'admin.user_updated'
                    });
                    return response;
                },
                error => this.state.actions.adminUsers.updateUserError()
            );
    }

    deleteUser(userUuid: string): void {
        this.state.actions.adminUsers.deleteUserStart();

        this.api.admin.deactivateUser({userUuid})
        .subscribe(() => {
            this.state.actions.adminUsers.deleteUserSuccess(userUuid);
            this.notification.show({
                type: 'success',
                message: 'admin.user_deleted'
            });
        }, error => {
            this.state.actions.adminUsers.deleteUserError();
            this.notification.show({
                type: 'error',
                message: 'admin.user_deleted_error'
            });
        });
    }
}
