import { LightningElement,wire } from 'lwc';
/**Navigation  */
import {NavigationMixin} from 'lightning/navigation'

import CAR_OBJECT from '@salesforce/schema/Car__c'
import NAME_FIELD from '@salesforce/schema/Car__c.Name'
import PICTURE_URL_FIELD from '@salesforce/schema/Car__c.Picture_URL__c'
import CATEGORY_FIELD from '@salesforce/schema/Car__c.Category__c'
import MAKE_FIELD from '@salesforce/schema/Car__c.Make__c'
import MSRP_FIELD from '@salesforce/schema/Car__c.MSRP__c'
import FUEL_FIELD from '@salesforce/schema/Car__c.Fuel_Type__c'
import SEAT_FIELD from '@salesforce/schema/Car__c.Number_of_Seats__c'
import CONTROL_FIELD from '@salesforce/schema/Car__c.Control__c'

//getFieldValue function use extract field value
import { getFieldValue } from 'lightning/uiRecordApi';

import { subscribe, MessageContext,unsubscribe } from 'lightning/messageService';
import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'
export default class CarCard extends NavigationMixin(LightningElement) {

    @wire(MessageContext)
    messageContext


    //exporting field in template
    // nameField = NAME_FIELD
    // pictureUrlField = PICTURE_URL_FIELD
    categpryField = CATEGORY_FIELD
    makeField = MAKE_FIELD
    msrpField = MSRP_FIELD
    fuelField = FUEL_FIELD
    seatField = SEAT_FIELD
    controlField = CONTROL_FIELD

    recordId

    carName
    carPictureUrl

    carSelectionSubscription
    handleRecordLoaded(event){
        const {records} = event.detail
        const recordData = records[this.recordId]
        this.carName = getFieldValue(recordData,NAME_FIELD)
        this.carPictureUrl = getFieldValue(recordData,PICTURE_URL_FIELD)
    }

    connectedCallback(){
        this.subscribeHandler()
    }
    subscribeHandler(){
        this.carSelectionSubscription = subscribe(this.messageContext, CARS_SELECTED_MESSAGE, (message)=>this.handlerCarSelected(message))
    }

    handlerCarSelected(message){
        this.recordId = message.carId
    }
    disconnectedCallback(){
        unsubscribe(this.carSelectionSubscription)
        this.carSelectionSubscription = null
    }

    /** navigate to record Page */
    handleNavigateToRecord(){
        this[NavigationMixin.Navigate]({
            type:'standard__recordPage',
            attributes:{
                recordId:this.recordId,
                objectApiName:CAR_OBJECT.objectApiName,
                actionName:'view'
            }
        })
    }
}