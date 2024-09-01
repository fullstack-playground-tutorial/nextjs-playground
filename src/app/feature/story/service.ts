import { HttpService } from "@/app/utils/http/http-default";
import { Story, StoryFilter, StoryService } from "./story";

export class StoryClient implements StoryService {
  constructor(private httpService: HttpService, private url: string) {
    this.all = this.all.bind(this);
    this.delay = this.delay.bind(this);
  }

  async all(filter: StoryFilter): Promise<Story[]> {
    await this.delay(1000);
    return [{id:"1"},{id:"2"},{id:"3"},{id:"4"}];
  }
  delay(t: number) {
    return new Promise((resolve) => setTimeout(resolve, t));
  }
}