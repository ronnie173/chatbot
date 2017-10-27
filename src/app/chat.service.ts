import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import { ApiAiClient } from 'api-ai-javascript';


// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {
  }
}

@Injectable()
export class ChatService {
  readonly token = environment.dialogflow.angularBot;
  readonly client = new ApiAiClient({accessToken: this.token});
  conversation = new BehaviorSubject<Message[]>([]);

  constructor() {
  }

  // sends and receives messages via dialogflow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
      .then(res => {
        const speech = res.result.fulfillment.speech;
        const botMessage = new Message(speech, 'bot');
        this.update(botMessage);
      });
  }


 update(msg: Message) {
    this.conversation.next([msg]);
  }
}
