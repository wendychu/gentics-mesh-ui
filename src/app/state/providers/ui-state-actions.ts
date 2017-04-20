import { Injectable } from '@angular/core';
import { CloneDepth, Immutable, StateActionBranch } from 'immutablets';

import { AppState } from '../models/app-state.model';
import { UIState } from '../models/ui-state.model';


@Injectable()
@Immutable()
export class UIStateActions extends StateActionBranch<AppState> {
    @CloneDepth(1) private ui: UIState;

    constructor() {
        super({
            uses: ['ui'],
            initialState: {
                ui: {
                    currentLanguage: 'en'
                }
            }
        });
    }

    setLanguage(newUiLanguage: string): void {
        this.ui.currentLanguage = newUiLanguage;
    }
}
