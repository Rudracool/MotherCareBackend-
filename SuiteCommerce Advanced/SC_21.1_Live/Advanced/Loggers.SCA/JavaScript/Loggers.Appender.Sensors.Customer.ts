/*
	© 2020 NetSuite Inc.
	User may not copy, modify, distribute, or re-bundle or otherwise make available this code;
	provided, however, if you are an authorized user with a NetSuite account or log-in, you
	may use this code subject to the terms that govern your access and use.
*/

/// <amd-module name="Loggers.Appender.Sensors.Customer"/>
import { ProfileModel } from '../../../Commons/Profile/JavaScript/Profile.Model';

interface Customer {
    customerSessionStatus: string;
}
export function customer(): Customer {
    const profile_model = ProfileModel.getInstance();
    const isGuest = profile_model.get('isGuest') === 'T';
    const isLoggedIn = !isGuest && profile_model.get('isLoggedIn') === 'T';
    const isRecognized = !isGuest && profile_model.get('isRecognized') === 'T';
    const isReturning = !isGuest && isLoggedIn;
    const isNew = !isGuest && !isRecognized && !isLoggedIn;

    let customerSessionStatus = '';
    if (isNew) {
        customerSessionStatus = 'New';
    } else if (isReturning) {
        customerSessionStatus = 'Returning';
    } else if (isGuest) {
        customerSessionStatus = 'Guest';
    } else if (isRecognized) {
        customerSessionStatus = 'Recognized';
    }
    return { customerSessionStatus };
}
