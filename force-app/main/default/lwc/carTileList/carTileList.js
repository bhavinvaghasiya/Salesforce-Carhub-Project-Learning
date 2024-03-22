import { LightningElement,wire } from 'lwc';
import getCars from '@salesforce/apex/CarController.getCars'

//Lightning message service and message channel
import CARS_FILTERED_MESSAGE from '@salesforce/messageChannel/CarsFiltered__c'
import { publish, subscribe, MessageContext } from 'lightning/messageService';

import CARS_SELECTED_MESSAGE from '@salesforce/messageChannel/CarSelected__c'
export default class CarTileList extends LightningElement {
    cars=[]
    error
    filters={};
    carFilterSubscription

    @wire(getCars,{filters:'$filters'})
    carsHandler({data,error}){
        if(data){
            console.log(data)
            this.cars = data
        }if(error){
            this.error = error
            console.error(error)
        }
    }

    /**Load Context for LMS */
    @wire(MessageContext)
    messageContext

    connectedCallback(){
        this.subscribeHandler()
    }

    subscribeHandler(){
        this.carFilterSubscription = subscribe(this.messageContext,CARS_FILTERED_MESSAGE,(message)=>this.handleFilterChanges(message))
    }

    handleFilterChanges(message){
        console.log(message.filters)
        this.filters = {...message.filters}
    }

    handleCarSelected(event){
        console.log("Selected Car Id ", event.detail)
        publish(this.messageContext, CARS_SELECTED_MESSAGE, {
            carId:event.detail
        })
    }
    disconnectedCallback(){
        unsubscribe(this.carFilterSubscription)
        this.carFilterSubscription = null
    }
}