module meshAdminUi {

    /**
     * Central event-dispatching system. To be used instead of littering $scope.$on() calls around the code.
     */
    export class Dispatcher {

        public events = {
            loginSuccess: 'mesh:loginSuccess',
            logoutSuccess: 'mesh:logoutSuccess',
            wipsChanged: 'mesh:wipsChanged'
        };

        private callbacks: any[] = [];

        constructor(private $rootScope: ng.IRootScopeService) {

        }

        public subscribe(event: string, callback: (event: ng.IAngularEvent, ...args: any[]) => any) {
            this.validateEvent(event);
            let unsubscribe = this.$rootScope.$on(event, callback);
            this.callbacks.push({
                fn: callback,
                unsubscribe: unsubscribe
            });
        }

        /**
         * Unsubscribe the callback function from all events it is subscribed to.
         * @param callback
         */
        public unsubscribeAll(callback: Function) {
            this.callbacks.forEach(obj => {
                if (obj.fn === callback) {
                    obj.unsubscribe();
                }
            });
            this.callbacks = this.callbacks.filter(obj => obj.fn !== callback);
        }

        public publish(event: string, ...args) {
            this.validateEvent(event);
            this.$rootScope.$broadcast(event, ...args);
        }

        /**
         * Ensure the event string is valid as per the events defined in the static "events" object.
         */
        private validateEvent(event: string): boolean {
            for (let label in this.events) {
                let validEvent = this.events[label];
                if (validEvent === event) {
                    return true;
                }
            }
            throw new Error(`despatcher#validateEvent: The event "${event}" is not valid.`);
        }

    }

    angular.module('meshAdminUi.common')
        .service('dispatcher', Dispatcher);

}